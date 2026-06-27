function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDefaultFilters() {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - 30);

  return {
    fromDate: formatDate(from),
    toDate: formatDate(to),
    device: "all",
    browser: "all",
    country: "all",
    granularity: "daily",
  };
}

export function normalizeEvent(event) {
  const payload = event.eventPayload || {};

  return {
    createdAt: event.createdAt,
    sessionId: event.sessionId,
    deviceType: (payload.device?.device_type || "unknown").toLowerCase(),
    browser: payload.device?.browser_name || "Unknown",
    os: payload.device?.os_name || "Unknown",
    country: (payload.country || "Unknown").toUpperCase(),
    pathname: payload.page?.pathname || payload.page?.url || "/",
    referrer: payload.referrer || "",
  };
}

export function filterEvents(events, filters) {
  if (!Array.isArray(events)) return [];

  const from = new Date(`${filters.fromDate}T00:00:00`);
  const to = new Date(`${filters.toDate}T23:59:59`);

  return events.filter((event) => {
    const normalized = normalizeEvent(event);
    const createdAt = new Date(event.createdAt);

    if (createdAt < from || createdAt > to) return false;
    if (filters.device !== "all" && normalized.deviceType !== filters.device) {
      return false;
    }
    if (
      filters.browser !== "all" &&
      normalized.browser.toLowerCase() !== filters.browser.toLowerCase()
    ) {
      return false;
    }
    if (
      filters.country !== "all" &&
      normalized.country.toLowerCase() !== filters.country.toLowerCase()
    ) {
      return false;
    }

    return true;
  });
}

export function computeStats(events) {
  const sessionIds = new Set(events.map((event) => event.sessionId));

  return {
    totalVisitors: sessionIds.size,
    pageViews: events.length,
    sessions: sessionIds.size,
  };
}

function getBucketKey(dateValue, granularity) {
  const date = new Date(dateValue);

  if (granularity === "weekly") {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);
    return formatDate(monday);
  }

  return formatDate(date);
}

export function getTrafficOverTime(events, granularity = "daily") {
  const buckets = {};

  events.forEach((event) => {
    const key = getBucketKey(event.createdAt, granularity);

    if (!buckets[key]) {
      buckets[key] = { date: key, pageViews: 0, sessionIds: new Set() };
    }

    buckets[key].pageViews += 1;
    buckets[key].sessionIds.add(event.sessionId);
  });

  return Object.values(buckets)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(({ date, pageViews, sessionIds }) => ({
      date,
      pageViews,
      visitors: sessionIds.size,
      sessions: sessionIds.size,
    }));
}

function countBy(events, getKey) {
  const counts = {};

  events.forEach((event) => {
    const key = getKey(normalizeEvent(event));
    counts[key] = (counts[key] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getDeviceTypes(events) {
  return countBy(events, (event) => event.deviceType);
}

export function getTopBrowsers(events) {
  return countBy(events, (event) => event.browser).map((item) => ({
    browser: item.name,
    value: item.value,
  }));
}

export function getTopCountries(events) {
  return countBy(events, (event) => event.country).map((item) => ({
    country: item.name,
    visitors: item.value,
  }));
}

export function getOperatingSystems(events) {
  return countBy(events, (event) => event.os).map((item) => ({
    os: item.name,
    users: item.value,
  }));
}

export function getTopPages(events) {
  const counts = {};

  events.forEach((event) => {
    const path = normalizeEvent(event).pathname;
    counts[path] = (counts[path] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([views, users]) => ({ views, users }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 10);
}

export function getTrafficSources(events, siteDomain = "") {
  let direct = 0;
  let other = 0;

  events.forEach((event) => {
    const referrer = normalizeEvent(event).referrer;

    if (!referrer) {
      direct += 1;
      return;
    }

    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      const domain = siteDomain.replace(/^www\./, "");

      if (domain && host.includes(domain)) {
        direct += 1;
      } else {
        other += 1;
      }
    } catch {
      other += 1;
    }
  });

  const total = direct + other || 1;

  return [
    { name: "Direct", value: Math.round((direct / total) * 100) },
    { name: "Other", value: Math.round((other / total) * 100) },
  ];
}

export function getFilterOptions(events) {
  const browsers = new Set();
  const countries = new Set();
  const devices = new Set();

  events.forEach((event) => {
    const normalized = normalizeEvent(event);
    browsers.add(normalized.browser);
    countries.add(normalized.country);
    devices.add(normalized.deviceType);
  });

  return {
    browsers: [...browsers].sort(),
    countries: [...countries].sort(),
    devices: [...devices].sort(),
  };
}
