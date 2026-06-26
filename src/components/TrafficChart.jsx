import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const TrafficChart = ({ data = [] }) => {
  // Convert raw events → chart format
  const chartData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    const grouped = {};

    data.forEach((event) => {
      if (!event?.createdAt) return;

      const date = new Date(event.createdAt)
        .toISOString()
        .split("T")[0];

      if (!grouped[date]) {
        grouped[date] = 0;
      }

      grouped[date] += 1;
    });

    return Object.keys(grouped)
      .sort()
      .map((date) => ({
        date,
        visits: grouped[date],
      }));
  }, [data]);

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="visits"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrafficChart;