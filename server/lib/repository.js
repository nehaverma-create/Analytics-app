import { randomUUID } from "crypto";
import db from "../db.js";

export function generateTrackingId() {
  return randomUUID().replace(/-/g, "");
}

export function getWebsiteById(id) {
  return db.prepare("SELECT * FROM websites WHERE id = ?").get(id);
}

export function getWebsiteByTrackingId(trackingId) {
  const row = db
    .prepare(
      `SELECT id, tracking_id AS trackingId
       FROM websites
       WHERE tracking_id = ?
       LIMIT 1`
    )
    .get(trackingId);

  return row ?? null;
}

export function createWebsite({ name, domain }) {
  const id = randomUUID();
  const trackingId = generateTrackingId();

  db.prepare(
    `INSERT INTO websites (id, tracking_id, name, domain)
     VALUES (?, ?, ?, ?)`
  ).run(id, trackingId, name, domain);

  return getWebsiteById(id);
}

export function updateWebsite(id, { name, domain }) {
  db.prepare(`UPDATE websites SET name = ?, domain = ? WHERE id = ?`).run(
    name,
    domain,
    id
  );

  return getWebsiteById(id);
}

export function deleteWebsite(id) {
  const website = getWebsiteById(id);
  if (!website) return null;

  db.prepare("DELETE FROM events WHERE website_id = ?").run(id);
  db.prepare("DELETE FROM sessions WHERE website_id = ?").run(id);
  db.prepare("DELETE FROM websites WHERE id = ?").run(id);

  return website;
}

export function listWebsites() {
  return db.prepare("SELECT * FROM websites ORDER BY created_at DESC").all();
}

/**
 * @typedef {Object} EventInsert
 * @property {string} websiteId
 * @property {string} trackingId
 * @property {string} sessionId
 * @property {string} eventType
 * @property {string | undefined} pageUrl
 * @property {string | undefined} pagePath
 * @property {string | undefined} pageTitle
 * @property {string | undefined} referrer
 * @property {string} deviceType
 * @property {string} browser
 * @property {string} os
 * @property {string | undefined} country
 * @property {Date} createdAt
 */

/**
 * @typedef {Object} SessionUpsert
 * @property {string} id
 * @property {string} websiteId
 * @property {Date} firstSeenAt
 * @property {Date} lastSeenAt
 * @property {string} deviceType
 * @property {string} browser
 * @property {string} os
 * @property {string | null | undefined} country
 */

/** @param {EventInsert[]} events */
export function insertEvents(events) {
  if (events.length === 0) return;

  const insert = db.prepare(
    `INSERT INTO events (
      id, website_id, tracking_id, session_id, event_type,
      page_url, page_path, page_title, referrer,
      device_type, browser, os, country, created_at
    ) VALUES (
      @id, @websiteId, @trackingId, @sessionId, @eventType,
      @pageUrl, @pagePath, @pageTitle, @referrer,
      @deviceType, @browser, @os, @country, @createdAt
    )`
  );

  const insertMany = db.transaction((rows) => {
    for (const event of rows) {
      insert.run({
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
        createdAt: event.createdAt.toISOString(),
      });
    }
  });

  insertMany(events);
}

/** @param {SessionUpsert} session */
export function upsertSession(session) {
  db.prepare(
    `INSERT INTO sessions (
      id, website_id, first_seen_at, last_seen_at,
      device_type, browser, os, country
    ) VALUES (
      @id, @websiteId, datetime('now'), datetime('now'),
      @deviceType, @browser, @os, @country
    )
    ON CONFLICT(id) DO UPDATE SET
      last_seen_at = datetime('now'),
      device_type = COALESCE(excluded.device_type, sessions.device_type),
      browser = COALESCE(excluded.browser, sessions.browser),
      os = COALESCE(excluded.os, sessions.os),
      country = COALESCE(excluded.country, sessions.country)`
  ).run({
    id: session.id,
    websiteId: session.websiteId,
    deviceType: session.deviceType,
    browser: session.browser,
    os: session.os,
    country: session.country ?? null,
  });
}

export function getActiveUsers(websiteId, minutes = 5) {
  const website = getWebsiteById(websiteId);
  if (!website) return null;

  const row = db
    .prepare(
      `SELECT COUNT(*) AS activeUsers
       FROM sessions
       WHERE website_id = ?
         AND last_seen_at >= datetime('now', ?)`
    )
    .get(websiteId, `-${minutes} minutes`);

  return row?.activeUsers ?? 0;
}

function mapEventRow(event) {
  return {
    id: event.id,
    sessionId: event.session_id,
    eventType: event.event_type,
    createdAt: event.created_at,
    eventPayload: {
      page: {
        url: event.page_url,
        pathname: event.page_path,
        title: event.page_title,
      },
      device: {
        device_type: event.device_type,
        browser_name: event.browser,
        os_name: event.os,
      },
      referrer: event.referrer || "",
      timestamp: event.created_at,
      country: event.country,
    },
  };
}

export function getOverview(websiteId, days = 30) {
  const website = getWebsiteById(websiteId);
  if (!website) return null;

  const stats = db
    .prepare(
      `SELECT
         COUNT(*) AS pageViews,
         COUNT(DISTINCT session_id) AS sessions
       FROM events
       WHERE website_id = ?
         AND created_at >= datetime('now', ?)`
    )
    .get(websiteId, `-${days} days`);

  const events = db
    .prepare(
      `SELECT *
       FROM events
       WHERE website_id = ?
         AND created_at >= datetime('now', ?)
       ORDER BY created_at ASC`
    )
    .all(websiteId, `-${days} days`);

  return {
    pageViews: stats?.pageViews ?? 0,
    sessions: stats?.sessions ?? 0,
    totalVisitors: stats?.sessions ?? 0,
    events: events.map(mapEventRow),
  };
}
