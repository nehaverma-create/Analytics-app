import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  websites: [],
};

const websitesSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    addWebsite: (state, action) => {
      state.websites.push({
        id: crypto.randomUUID(),
        websiteName: action.payload.websiteName,
        domain: action.payload.domain,
        createdAt:
          action.payload.createdAt ?? new Date().toLocaleDateString(),
        trackingScript: action.payload.trackingScript ?? "Hello World",
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
      state.websites = state.websites.filter(
        (w) => w.id !== action.payload
      );
    },
  },
});

export const { addWebsite, updateWebsite, deleteWebsite } =
  websitesSlice.actions;

export default websitesSlice.reducer;