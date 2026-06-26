import "dotenv/config";
import cors from "cors";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import {
  createWebsite,
  getActiveUsers,
  getOverview,
  listWebsites,
} from "./lib/repository.js";
import { handleTrackOptions, handleTrackPost } from "./routes/track.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3010;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
const TRACKER_APP_URL =
  process.env.TRACKER_APP_URL || `http://localhost:${PORT}`;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "8kb" }));
app.use(express.static(join(__dirname, "../public")));

function buildTrackingScript(trackingId) {
  const base = API_BASE_URL.replace(/\/$/, "");
  const tracker = TRACKER_APP_URL.replace(/\/$/, "");

  return `<script
  src="${tracker}/tracker.js"
  data-tracking-id="${trackingId}"
  data-endpoint="${base}/api/track"
  async></script>`;
}

function formatWebsite(website) {
  return {
    id: website.id,
    trackingId: website.trackingId,
    name: website.name,
    domain: website.domain,
    createdAt: website.createdAt,
    trackingScript: buildTrackingScript(website.trackingId),
  };
}

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.options("/api/track", handleTrackOptions);
app.post("/api/track", handleTrackPost);

app.get("/api/websites", async (_req, res) => {
  const rows = await listWebsites();
  res.json(rows.map(formatWebsite));
});

app.post("/api/websites", async (req, res) => {
  const { name, domain } = req.body || {};

  if (!name?.trim() || !domain?.trim()) {
    return res.status(400).json({ error: "name and domain are required" });
  }

  const website = await createWebsite({
    name: name.trim(),
    domain: domain.trim(),
  });

  res.status(201).json(formatWebsite(website));
});

app.get("/api/analytics/active", async (req, res) => {
  const websiteId = req.query.websiteId;
  const minutes = Number(req.query.minutes) || 5;

  if (!websiteId) {
    return res.status(400).json({ error: "websiteId is required" });
  }

  const activeUsers = await getActiveUsers(websiteId, minutes);

  if (activeUsers === null) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json({ activeUsers });
});

app.get("/api/analytics/overview", async (req, res) => {
  const websiteId = req.query.websiteId;
  const days = Number(req.query.days) || 30;

  if (!websiteId) {
    return res.status(400).json({ error: "websiteId is required" });
  }

  const overview = await getOverview(websiteId, days);

  if (!overview) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json(overview);
});

await connectDb();

app.listen(PORT, () => {
  console.log(`API running at ${API_BASE_URL}`);
});
