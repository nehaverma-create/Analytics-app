import { createSlice } from "@reduxjs/toolkit";

const APP_URL =
  import.meta.env.VITE_APP_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5173"
    : "https://analytics-app-kappa.vercel.app");

const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3010" : APP_URL);

const buildTrackingScript = (trackingId) =>
  `<script
  src="${APP_URL.replace(/\/$/, "")}/tracker.js"
  data-tracking-id="${trackingId}"
  data-endpoint="${API_BASE.replace(/\/$/, "")}/api/track"
  async></script>`;

const generateTrackingId = () => {
  return crypto.randomUUID().replace(/-/g, "");
};

const initialState = {
  websites: [],
};

const websitesSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    addWebsite: (state, action) => {
      const trackingId = action.payload.trackingId ?? generateTrackingId();

      state.websites.push({
        id: action.payload.id ?? crypto.randomUUID(),
        websiteName: action.payload.websiteName,
        domain: action.payload.domain,
        createdAt:
          action.payload.createdAt ?? new Date().toLocaleDateString(),
        trackingId,
        trackingScript:
          action.payload.trackingScript ??
          buildTrackingScript(trackingId),
      });
    },

    updateWebsite: (state, action) => {
      const { id, websiteName, domain } = action.payload;
      const website = state.websites.find((w) => w.id === id);

      if (website) {
        website.websiteName = websiteName;
        website.domain = domain;
      }
    },

    deleteWebsite: (state, action) => {
      state.websites = state.websites.filter((w) => w.id !== action.payload);
    },

    resetWebsites: (state) => {
      state.websites = [];
    },
  },
});

export const {
  addWebsite,
  updateWebsite,
  deleteWebsite,
  resetWebsites,
} = websitesSlice.actions;

export default websitesSlice.reducer;   
