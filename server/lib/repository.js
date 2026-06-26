import { randomUUID } from "crypto";
import { getDb } from "../db.js";

const websites = () => getDb().collection("websites");
const sessions = () => getDb().collection("sessions");
const events = () => getDb().collection("events");

export function generateTrackingId() {
  return randomUUID().replace(/-/g, "");
}

export async function getWebsiteById(id) {
  return websites().findOne({ id });
}

export async function getWebsiteByTrackingId(trackingId) {
  return websites().findOne(
    { trackingId },
    { projection: { id: 1, trackingId: 1 } }
  );
}

export async function createWebsite({ name, domain }) {
  const website = {
    id: randomUUID(),
    trackingId: generateTrackingId(),
    name,
    domain,
    createdAt: new Date().toISOString(),
  };

  await websites().insertOne(website);
  return website;
}

export async function listWebsites() {
  return websites().find({}).sort({ createdAt: -1 }).toArray();
}

export async function insertEvents(rows) {
  if (rows.length === 0) return;

  await events().insertMany(
    rows.map((event) => ({
      id: randomUUID(),
      websiteId: event.websiteId,
      trackingId: event.trackingId,
      sessionId: event.sessionId,
      eventType: event.eventType,
      pageUrl: event.pageUrl ?? null,
      pagePath: event.pagePath ?? null,
      pageTitle: event.pageTitle ?? null,
      referrer: event.referrer ?? null,
      deviceType: event.deviceType,
      browser: event.browser,
      os: event.os,
      country: event.country ?? null,
      createdAt: new Date(),
    }))
  );
}

export async function upsertSession(session) {
  const now = new Date();

  await sessions().updateOne(
    { id: session.id },
    {
      $set: {
        websiteId: session.websiteId,
        lastSeenAt: now,
        deviceType: session.deviceType,
        browser: session.browser,
        os: session.os,
        country: session.country ?? null,
      },
      $setOnInsert: {
        id: session.id,
        firstSeenAt: now,
      },
    },
    { upsert: true }
  );
}

export async function getActiveUsers(websiteId, minutes = 5) {
  const website = await getWebsiteById(websiteId);
  if (!website) return null;

  const since = new Date(Date.now() - minutes * 60 * 1000);

  return sessions().countDocuments({
    websiteId,
    lastSeenAt: { $gte: since },
  });
}

export async function getOverview(websiteId, days = 30) {
  const website = await getWebsiteById(websiteId);
  if (!website) return null;

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const rows = await events()
    .find({ websiteId, createdAt: { $gte: since } })
    .sort({ createdAt: 1 })
    .toArray();

  const sessionIds = new Set(rows.map((event) => event.sessionId));

  return {
    pageViews: rows.length,
    sessions: sessionIds.size,
    totalVisitors: sessionIds.size,
    events: rows.map((event) => {
      const createdAt =
        event.createdAt instanceof Date
          ? event.createdAt.toISOString()
          : event.createdAt;

      return {
        id: event.id,
        sessionId: event.sessionId,
        eventType: event.eventType,
        createdAt,
        eventPayload: {
          page: {
            url: event.pageUrl,
            pathname: event.pagePath,
            title: event.pageTitle,
          },
          device: {
            device_type: event.deviceType,
            browser_name: event.browser,
            os_name: event.os,
          },
          referrer: event.referrer || "",
          timestamp: createdAt,
          country: event.country,
        },
      };
    }),
  };
}
