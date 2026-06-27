import "dotenv/config";
import cors from "cors";
import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { connectDb } from "./db.js";
import {
  createWebsite,
  deleteWebsite,
  getActiveUsers,
  getDashboardTotals,
  getOverview,
  listWebsites,
  updateWebsite,
} from "./lib/repository.js";
import { requireAuth } from "./middleware/auth.js";
import { handleTrackOptions, handleTrackPost } from "./routes/track.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3011;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
const TRACKER_APP_URL =
  process.env.TRACKER_APP_URL || `http://localhost:${PORT}`;

app.set("trust proxy", true);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "8kb" }));
app.use(express.static(join(__dirname, "../public")));

async function requireDb(_req, res, next) {
  try {
    await connectDb();
    next();
  } catch (error) {
    console.error("MongoDB error:", error.message);
    res.status(503).json({
      error:
        "Database unavailable. In MongoDB Atlas go to Network Access and allow your IP (or 0.0.0.0/0 for dev).",
    });
  }
}

function buildTrackingScript(trackingId) {
  const base = API_BASE_URL.replace(/\/$/, "");
  const tracker = TRACKER_APP_URL.replace(/\/$/, "");

  return `<script
  src="${tracker}/tracker.js"
  data-tracking-id="${trackingId}"
  data-endpoint="${base}/api/track"
  async
  >
  </script>`;
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

app.get("/health", async (_req, res) => {
  try {
    await connectDb();
    res.json({ ok: true, database: "connected" });
  } catch {
    res.status(503).json({ ok: false, database: "disconnected" });
  }
});

app.use("/api", requireDb);

app.options("/api/track", handleTrackOptions);
app.post("/api/track", handleTrackPost);

app.get("/api/websites", requireAuth, async (req, res) => {
  const rows = await listWebsites(req.user.email);
  res.json(rows.map(formatWebsite));
});

app.post("/api/websites", requireAuth, async (req, res) => {
  const { name, domain } = req.body || {};

  if (!name?.trim() || !domain?.trim()) {
    return res.status(400).json({ error: "name and domain are required" });
  }

  const website = await createWebsite({
    name: name.trim(),
    domain: domain.trim(),
    userEmail: req.user.email,
    userId: req.user.userId,
  });

  res.status(201).json(formatWebsite(website));
});

app.put("/api/websites/:id", requireAuth, async (req, res) => {
  const { name, domain } = req.body || {};

  if (!name?.trim() || !domain?.trim()) {
    return res.status(400).json({ error: "name and domain are required" });
  }

  const website = await updateWebsite(req.params.id, req.user.email, {
    name: name.trim(),
    domain: domain.trim(),
  });

  if (!website) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json(formatWebsite(website));
});

app.delete("/api/websites/:id", requireAuth, async (req, res) => {
  const website = await deleteWebsite(req.params.id, req.user.email);

  if (!website) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json({ ok: true });
});

app.get("/api/analytics/summary", requireAuth, async (req, res) => {
  const days = Number(req.query.days) || 30;
  const minutes = Number(req.query.minutes) || 5;

  const totals = await getDashboardTotals(req.user.email, days, minutes);
  res.json(totals);
});

app.get("/api/analytics/active", requireAuth, async (req, res) => {
  const websiteId = req.query.websiteId;
  const minutes = Number(req.query.minutes) || 5;

  if (!websiteId) {
    return res.status(400).json({ error: "websiteId is required" });
  }

  const activeUsers = await getActiveUsers(websiteId, req.user.email, minutes);

  if (activeUsers === null) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json({ activeUsers });
});

app.get("/api/analytics/overview", requireAuth, async (req, res) => {
  const websiteId = req.query.websiteId;
  const days = Number(req.query.days) || 30;
  const from = req.query.from;
  const to = req.query.to;

  if (!websiteId) {
    return res.status(400).json({ error: "websiteId is required" });
  }

  const overview = await getOverview(websiteId, req.user.email, {
    from,
    to,
    days,
  });

  if (!overview) {
    return res.status(404).json({ error: "Website not found" });
  }

  res.json(overview);
});

app.listen(PORT, () => {
  console.log(`API running at ${API_BASE_URL}`);

  connectDb()
    .then(() => console.log("MongoDB connected"))
    .catch((error) => {
      console.error("MongoDB connection failed:", error.message);
      console.error(
        "→ MongoDB Atlas → Network Access → Add IP Address (use 0.0.0.0/0 for dev)"
      );
    });
});
