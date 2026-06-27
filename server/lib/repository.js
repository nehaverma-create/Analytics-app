import { randomUUID } from "crypto";
import { getDb } from "../db.js";

const websites = () => getDb().collection("websites");
const sessions = () => getDb().collection("sessions");
const events = () => getDb().collection("events");

export function generateTrackingId() {
  return randomUUID().replace(/-/g, "");
}

export async function getWebsiteById(id, userEmail) {
  return websites().findOne({ id, userEmail });
}

export async function getWebsiteByTrackingId(trackingId) {
  return websites().findOne(
    { trackingId },
    { projection: { id: 1, trackingId: 1 } }
  );
}

export async function createWebsite({ name, domain, userEmail, userId }) {
  const website = {
    id: randomUUID(),
    trackingId: generateTrackingId(),
    name,
    domain,
    userEmail,
    userId,
    createdAt: new Date().toISOString(),
  };

  await websites().insertOne(website);
  return website;
}

export async function listWebsites(userEmail) {
  return websites().find({ userEmail }).sort({ createdAt: -1 }).toArray();
}

export async function updateWebsite(id, userEmail, { name, domain }) {
  const result = await websites().updateOne(
    { id, userEmail },
    { $set: { name, domain } }
  );

  if (result.matchedCount === 0) return null;
  return getWebsiteById(id, userEmail);
}

export async function deleteWebsite(id, userEmail) {
  const website = await getWebsiteById(id, userEmail);
  if (!website) return null;

  await Promise.all([
    events().deleteMany({ websiteId: id }),
    sessions().deleteMany({ websiteId: id }),
    websites().deleteOne({ id, userEmail }),
  ]);

  return website;
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

export async function getOverview(websiteId, userEmail, options = {}) {
  const website = await getWebsiteById(websiteId, userEmail);
  if (!website) return null;

  const { from, to, days = 30 } = options;
  let since;
  let until = new Date();

  if (from && to) {
    since = new Date(`${from}T00:00:00`);
    until = new Date(`${to}T23:59:59`);
  } else {
    since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  }

  const rows = await events()
    .find({ websiteId, createdAt: { $gte: since, $lte: until } })
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
          country: event.country ?? null,
        },
      };
    }),
  };
}

export async function getActiveUsers(websiteId, userEmail, minutes = 5) {
  const website = await getWebsiteById(websiteId, userEmail);
  if (!website) return null;

  const since = new Date(Date.now() - minutes * 60 * 1000);

  return sessions().countDocuments({
    websiteId,
    lastSeenAt: { $gte: since },
  });
}

export async function getDashboardTotals(userEmail, days = 30, activeMinutes = 5) {
  const userWebsites = await websites()
    .find({ userEmail }, { projection: { id: 1 } })
    .toArray();

  const websiteIds = userWebsites.map((site) => site.id);

  if (websiteIds.length === 0) {
    return {
      totalVisitors: 0,
      pageViews: 0,
      sessions: 0,
      activeUsers: 0,
    };
  }

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const activeSince = new Date(Date.now() - activeMinutes * 60 * 1000);

  const [eventStats, activeUsers] = await Promise.all([
    events()
      .aggregate([
        {
          $match: {
            websiteId: { $in: websiteIds },
            createdAt: { $gte: since },
          },
        },
        {
          $group: {
            _id: null,
            pageViews: { $sum: 1 },
            sessions: { $addToSet: "$sessionId" },
          },
        },
      ])
      .toArray(),
    sessions().countDocuments({
      websiteId: { $in: websiteIds },
      lastSeenAt: { $gte: activeSince },
    }),
  ]);

  const stats = eventStats[0];
  const sessionCount = stats?.sessions?.length ?? 0;

  return {
    pageViews: stats?.pageViews ?? 0,
    sessions: sessionCount,
    totalVisitors: sessionCount,
    activeUsers,
  };
}
