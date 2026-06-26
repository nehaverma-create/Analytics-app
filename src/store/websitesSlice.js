import { createSlice } from "@reduxjs/toolkit";

const generateTrackingId = () => {
  // 32-character unique ID
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
      const trackingId = generateTrackingId();

      state.websites.push({
        id: crypto.randomUUID(),
        websiteName: action.payload.websiteName,
        domain: action.payload.domain,
        createdAt:
          action.payload.createdAt ?? new Date().toLocaleDateString(),
        trackingId,
        trackingScript: `<script
  src="https://analytics.utkarsh.app/tracker.js"
  data-tracking-id="${trackingId}"
  data-endpoint="http://localhost:3000/api/track"
  async></script>`,
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
