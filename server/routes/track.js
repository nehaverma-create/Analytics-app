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

function applyCors(res) {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}

function toString(value, maxLength) {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > maxLength ? trimmed.slice(0, maxLength) : trimmed;
}

export function handleTrackOptions(_req, res) {
  applyCors(res);
  res.status(204).end();
}

export async function handleTrackPost(req, res) {
  applyCors(res);

  try {
    const body = req.body;
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const trackingId = toString(body.tracking_id, 64);
    const sessionId = toString(body.session_id, 64);
    const eventType = toString(body.event_type, 50);
    const payload = body.event_payload;

    if (!trackingId || !sessionId || !eventType || !payload) {
      return res.status(400).json({ error: "Invalid event payload" });
    }

    const pageUrl = toString(payload?.page?.url, 1000);
    const pagePath = toString(payload?.page?.pathname, 1000);

    if (!pageUrl && !pagePath) {
      return res.status(400).json({ error: "Page data is required" });
    }

    const website = await getWebsiteByTrackingId(trackingId);
    if (!website) {
      return res.status(404).json({ error: "Tracking ID not found" });
    }

    const deviceType = ["mobile", "tablet", "desktop"].includes(
      payload?.device?.device_type
    )
      ? payload.device.device_type
      : "unknown";

    await upsertSession({
      id: sessionId,
      websiteId: website.id,
      deviceType,
      browser: toString(payload?.device?.browser_name, 100) ?? "Unknown",
      os: toString(payload?.device?.os_name, 100) ?? "Unknown",
      country: null,
    });

    await insertEvents([
      {
        websiteId: website.id,
        trackingId,
        sessionId,
        eventType,
        pageUrl,
        pagePath,
        pageTitle: toString(payload?.page?.title, 500),
        referrer: toString(payload?.referrer, 500),
        deviceType,
        browser: toString(payload?.device?.browser_name, 100) ?? "Unknown",
        os: toString(payload?.device?.os_name, 100) ?? "Unknown",
        country: null,
      },
    ]);

    res.json({ success: true });
  } catch (error) {
    console.error("Track error:", error);
    res.status(500).json({ error: "Unable to process tracking event" });
  }
}
