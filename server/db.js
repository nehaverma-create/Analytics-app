import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is required");
}

const client = new MongoClient(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
});

const dbName = process.env.MONGODB_DB_NAME || "Analytics";

let db;
let connectPromise;

export async function connectDb() {
  if (db) return db;

  if (!connectPromise) {
    connectPromise = (async () => {
      await client.connect();
      const database = client.db(dbName);

      await Promise.all([
        database.collection("websites").createIndex({ id: 1 }, { unique: true }),
        database
          .collection("websites")
          .createIndex({ trackingId: 1 }, { unique: true }),
        database.collection("websites").createIndex({ userEmail: 1 }),
        database
          .collection("sessions")
          .createIndex({ websiteId: 1, lastSeenAt: -1 }),
        database
          .collection("events")
          .createIndex({ websiteId: 1, createdAt: -1 }),
      ]);

      db = database;
      return db;
    })().catch((error) => {
      connectPromise = null;
      throw error;
    });
  }

  return connectPromise;
}

export function getDb() {
  if (!db) throw new Error("Database not connected");
  return db;
}

export function isDbConnected() {
  return Boolean(db);
}
