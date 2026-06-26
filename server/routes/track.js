import {
  getWebsiteByTrackingId,
  insertEvents,
  upsertSession,
} from "../lib/repository.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const MAX_BODY_BYTES = 8 * 1024;
const MAX_EVENTS_PER_REQUEST = 25;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 120;
const trackingBuckets = new Map();

function rateLimit(trackingId) {
  const now = Date.now();
  const bucket = trackingBuckets.get(trackingId);

  if (!bucket || bucket.resetAt <= now) {
    trackingBuckets.set(trackingId, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (bucket.count >= RATE_LIMIT_MAX) {
    return false;
  }

  bucket.count += 1;
  return true;
}

function pruneRateLimitBuckets() {
  if (trackingBuckets.size < 1000) return;

  const now = Date.now();
  for (const [key, bucket] of trackingBuckets.entries()) {
    if (bucket.resetAt <= now) {
      trackingBuckets.delete(key);
    }
  }
}

function toSafeString(value, maxLength) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > maxLength) return trimmed.slice(0, maxLength);
  return trimmed;
}

function toSafeCountry(value) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(trimmed)) return undefined;
  return trimmed;
}

function resolveCountry(req) {
  const headerCountry =
    toSafeCountry(req.headers["x-vercel-ip-country"]) ||
    toSafeCountry(req.headers["cf-ipcountry"]) ||
    toSafeCountry(req.headers["x-country"]) ||
    toSafeCountry(req.headers["x-geo-country"]);

  if (headerCountry) return headerCountry;

  if (process.env.NODE_ENV === "development") {
    return (
      toSafeCountry(process.env.TRACKING_DEV_COUNTRY) ||
      toSafeCountry(req.headers["x-dev-country"]) ||
      undefined
    );
  }

  return undefined;
}

function normalizeDeviceType(value) {
  if (value === "mobile" || value === "tablet" || value === "desktop") {
    return value;
  }
  return undefined;
}

function toEventPayload(value) {
  if (!value || typeof value !== "object") return null;
  return value;
}

function withCors(res, status, body) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  return res.status(status).json(body);
}

export function handleTrackOptions(_req, res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  return res.status(204).end();
}

export async function handleTrackPost(req, res) {
  try {
    const contentLength = Number(req.headers["content-length"] || "0");
    if (contentLength > MAX_BODY_BYTES) {
      return withCors(res, 413, { error: "Payload too large." });
    }

    const rawBody = req.body;
    if (!rawBody) {
      return withCors(res, 400, { error: "Malformed JSON payload." });
    }

    const payloads = Array.isArray(rawBody) ? rawBody : [rawBody];
    if (payloads.length === 0 || payloads.length > MAX_EVENTS_PER_REQUEST) {
      return withCors(res, 400, { error: "Invalid batch size." });
    }

    const normalizedPayloads = payloads
      .map(toEventPayload)
      .filter((value) => Boolean(value));

    if (normalizedPayloads.length !== payloads.length) {
      return withCors(res, 400, { error: "Invalid event payload." });
    }

    const trackingId = toSafeString(normalizedPayloads[0]?.tracking_id, 64);
    if (!trackingId) {
      return withCors(res, 400, { error: "Tracking ID is required." });
    }

    if (
      !normalizedPayloads.every((event) => event.tracking_id === trackingId)
    ) {
      return withCors(res, 400, {
        error: "Mixed tracking IDs are not allowed.",
      });
    }

    pruneRateLimitBuckets();
    if (!rateLimit(trackingId)) {
      return withCors(res, 429, { error: "Rate limit exceeded." });
    }

    const website = getWebsiteByTrackingId(trackingId);
    if (!website) {
      return withCors(res, 404, { error: "Tracking ID not found." });
    }

    const country = resolveCountry(req);
    const events = [];
    const sessions = new Map();

    for (const event of normalizedPayloads) {
      const eventType = toSafeString(event.event_type, 50);
      const payload = event.event_payload;
      const sessionId = toSafeString(event.session_id, 64);

      if (!eventType || !payload || !sessionId) {
        return withCors(res, 400, { error: "Invalid event payload." });
      }

      const pageUrl = toSafeString(payload?.page?.url, 1000);
      const pagePath = toSafeString(payload?.page?.pathname, 1000);
      const pageTitle = toSafeString(payload?.page?.title, 500);
      const referrer = toSafeString(payload?.referrer, 500);
      const deviceType =
        normalizeDeviceType(payload?.device?.device_type) ?? "unknown";
      const browser =
        toSafeString(payload?.device?.browser_name, 100) ?? "Unknown";
      const os = toSafeString(payload?.device?.os_name, 100) ?? "Unknown";
      const observedAt = new Date();

      if (!pageUrl && !pagePath) {
        return withCors(res, 400, { error: "Page data is required." });
      }

      events.push({
        websiteId: website.id,
        trackingId,
        sessionId,
        eventType,
        pageUrl,
        pagePath,
        pageTitle,
        referrer,
        deviceType,
        browser,
        os,
        country,
        createdAt: observedAt,
      });

      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, {
          id: sessionId,
          websiteId: website.id,
          firstSeenAt: observedAt,
          lastSeenAt: observedAt,
          deviceType,
          browser,
          os,
          country,
        });
      } else {
        const existing = sessions.get(sessionId);
        existing.lastSeenAt = observedAt;
      }
    }

    for (const session of sessions.values()) {
      upsertSession(session);
    }
    insertEvents(events);

    return withCors(res, 200, { success: true });
  } catch {
    return withCors(res, 500, { error: "Unable to process tracking event." });
  }
}
