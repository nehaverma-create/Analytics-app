/** Backend API origin. Empty string = same origin (Vite dev proxy). */
export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

/** Frontend origin (tracker.js script src). */
export const APP_BASE = (
  import.meta.env.VITE_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : "")
).replace(/\/$/, "");

export function apiUrl(path) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return API_BASE ? `${API_BASE}${normalized}` : normalized;
}
