import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_PATH || join(__dirname, "../data/analytics.db");

mkdirSync(dirname(dbPath), { recursive: true });

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

function migrateSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS websites (
      id TEXT PRIMARY KEY,
      tracking_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      domain TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const eventColumns = db.prepare("PRAGMA table_info(events)").all();
  const hasLegacyPayload = eventColumns.some((column) => column.name === "event_payload");

  if (hasLegacyPayload) {
    db.exec(`
      DROP TABLE IF EXISTS events;
      DROP TABLE IF EXISTS sessions;
    `);
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      website_id TEXT NOT NULL,
      first_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
      last_seen_at TEXT NOT NULL DEFAULT (datetime('now')),
      device_type TEXT NOT NULL DEFAULT 'unknown',
      browser TEXT NOT NULL DEFAULT 'Unknown',
      os TEXT NOT NULL DEFAULT 'Unknown',
      country TEXT,
      FOREIGN KEY (website_id) REFERENCES websites(id)
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      website_id TEXT NOT NULL,
      tracking_id TEXT NOT NULL,
      session_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      page_url TEXT,
      page_path TEXT,
      page_title TEXT,
      referrer TEXT,
      device_type TEXT NOT NULL DEFAULT 'unknown',
      browser TEXT NOT NULL DEFAULT 'Unknown',
      os TEXT NOT NULL DEFAULT 'Unknown',
      country TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (website_id) REFERENCES websites(id),
      FOREIGN KEY (tracking_id) REFERENCES websites(tracking_id)
    );

    CREATE INDEX IF NOT EXISTS idx_events_website_id ON events(website_id);
    CREATE INDEX IF NOT EXISTS idx_events_tracking_id ON events(tracking_id);
    CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);
    CREATE INDEX IF NOT EXISTS idx_events_session_id ON events(session_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_website_id ON sessions(website_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_last_seen_at ON sessions(last_seen_at);
  `);
}

migrateSchema();

export default db;
