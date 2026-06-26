export const getGraphData = (trackingId) => {
  const events = JSON.parse(
    localStorage.getItem(`analytics_${trackingId}`) || "[]"
  );

  const map = {};

  events.forEach((e) => {
    const date = e.event_payload.timestamp.split("T")[0];

    map[date] = (map[date] || 0) + 1;
  });

  return Object.keys(map).map((date) => ({
    date,
    visitors: map[date],
  }));
};