import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = process.env.MONGODB_DB_NAME || "Analytics";

let db;

export async function connectDb() {
  if (db) return db;

  await client.connect();
  db = client.db(dbName);

  await Promise.all([
    db.collection("websites").createIndex({ id: 1 }, { unique: true }),
    db.collection("websites").createIndex({ trackingId: 1 }, { unique: true }),
    db.collection("sessions").createIndex({ websiteId: 1, lastSeenAt: -1 }),
    db.collection("events").createIndex({ websiteId: 1, createdAt: -1 }),
  ]);

  return db;
}

export function getDb() {
  if (!db) throw new Error("Database not connected");
  return db;
}
