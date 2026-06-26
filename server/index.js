import cors from "cors";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import {
  createWebsite,
  deleteWebsite,
  getActiveUsers,
  getOverview,
  getWebsiteById,
  listWebsites,
  updateWebsite,
} from "./lib/repository.js";
import { handleTrackOptions, handleTrackPost } from "./routes/track.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3010;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
const TRACKER_APP_URL =
  process.env.TRACKER_APP_URL || "https://analytics-app-kappa.vercel.app";

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "8kb" }));

function buildTrackingScript(trackingId) {
  const appUrl = TRACKER_APP_URL.replace(/\/$/, "");
  const apiUrl = API_BASE_URL.replace(/\/$/, "");

  return `<script
  src="${appUrl}/tracker.js"
  data-tracking-id="${trackingId}"
  data-endpoint="${apiUrl}/api/track"
  async></script>`;
}

function formatWebsite(website) {
  return {
    id: website.id,
    trackingId: website.tracking_id,
    name: website.name,
    domain: website.domain,
    createdAt: website.created_at,
    trackingScript: buildTrackingScript(website.tracking_id),
  };
}

app.use(express.static(join(__dirname, "../public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.options("/api/track", handleTrackOptions);
app.post("/api/track", handleTrackPost);

app.get("/api/websites", (_req, res) => {
  res.json(listWebsites().map(formatWebsite));
});

app.post("/api/websites", (req, res) => {
  const { name, domain } = req.body || {};

  if (!name?.trim() || !domain?.trim()) {
    return res.status(400).json({ error: "name and domain are required" });
  }

  const website = createWebsite({
    name: name.trim(),
    domain: domain.trim(),
  });

  res.status(201).json(formatWebsite(website));
});

app.put("/api/websites/:id", (req, res) => {
  const { name, domain } = req.body || {};
  const website = getWebsiteById(req.params.id);

  if (!website) {
    return res.status(404).json({ error: "Website not found" });
  }

  if (!name?.trim() || !domain?.trim()) {
    return res.status(400).json({ error: "name and domain are required" });
  }

  const updated = updateWebsite(req.params.id, {
    name: name.trim(),
    domain: domain.trim(),
  });

  res.json(formatWebsite(updated));
});

app.delete("/api/websites/:id", (req, res) => {
  const website = deleteWebsite(req.params.id);

  if (!website) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json({ ok: true });
});

app.get("/api/analytics/active", (req, res) => {
  const websiteId = req.query.websiteId;
  const minutes = Number(req.query.minutes) || 5;

  if (!websiteId) {
    return res.status(400).json({ error: "websiteId is required" });
  }

  const activeUsers = getActiveUsers(websiteId, minutes);

  if (activeUsers === null) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json({ activeUsers });
});

app.get("/api/analytics/overview", (req, res) => {
  const websiteId = req.query.websiteId;
  const days = Number(req.query.days) || 30;

  if (!websiteId) {
    return res.status(400).json({ error: "websiteId is required" });
  }

  const overview = getOverview(websiteId, days);

  if (!overview) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json(overview);
});

app.listen(PORT, () => {
  console.log(`Analytics API running at ${API_BASE_URL}`);
});
