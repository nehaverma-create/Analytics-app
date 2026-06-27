import geoip from "geoip-lite";
import { normalizeCountry } from "../../shared/country.js";

const PRIVATE_IP_RE =
  /^(::1|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|fe80:|fc00:|fd)/i;

function normalizeIp(ip) {
  if (!ip) return "";
  const value = String(ip).trim();
  if (value.startsWith("::ffff:")) return value.slice(7);
  return value;
}

export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    const ip = String(forwarded).split(",")[0].trim();
    if (ip) return normalizeIp(ip);
  }

  const realIp = req.headers["x-real-ip"];
  if (realIp) return normalizeIp(String(realIp).trim());

  return normalizeIp(req.socket?.remoteAddress || "");
}

export function isPrivateIp(ip) {
  if (!ip) return true;
  return PRIVATE_IP_RE.test(ip) || ip === "localhost";
}

export function getCountryFromHeaders(req) {
  const header =
    req.headers["cf-ipcountry"] ||
    req.headers["x-vercel-ip-country"] ||
    req.headers["cloudfront-viewer-country"];

  if (!header || header === "XX" || header === "T1") return null;

  return normalizeCountry(String(header));
}

export function getCountryFromIp(ip) {
  if (!ip || isPrivateIp(ip)) return null;

  const geo = geoip.lookup(ip);
  return normalizeCountry(geo?.country || "");
}

export function resolveCountry(req, clientHint) {
  return (
    getCountryFromHeaders(req) ||
    getCountryFromIp(getClientIp(req)) ||
    normalizeCountry(clientHint)
  );
}
