import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { date: "May 26", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "May 27", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "May 28", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "May 29", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "May 30", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 01", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 03", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 05", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 07", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 09", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 11", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 12", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 14", "Page views": 7, Visitors: 3, Sessions: 3 },
  { date: "Jun 15", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 16", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 18", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 20", "Page views": 0, Visitors: 0, Sessions: 0 },
  { date: "Jun 22", "Page views": 2, Visitors: 1, Sessions: 1 },
  { date: "Jun 24", "Page views": 0, Visitors: 0, Sessions: 0 },
];

export default function TrafficChart() {
  return (
   <div className="traffic-card">
  <h3 className="traffic-chart-title">Traffic over time</h3>

  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={data}>
      <CartesianGrid
        vertical={false}
        stroke="#e5e7eb"
      />

      <XAxis
        dataKey="date"
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
      />

      <Tooltip />

          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="square"
            iconSize={6}
            wrapperStyle={{
              fontSize: "11px",
              lineHeight: "12px",
              paddingTop: "8px",
            }}
            formatter={(value) => (
    <span
      style={{
        fontSize: "12px",
        color: "black",
      }}
    >
      {value}
    </span>
  )}
          />

      <Line
        type="monotone"
        dataKey="Page views"
        stroke="#3b82f6"
        strokeWidth={2}
        dot={{ r: 2 }}
      />
       <Line
        type="monotone"
        dataKey="Visitors"
        stroke="#10b981"
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      <Line
        type="monotone"
        dataKey="Sessions"
        stroke="#8b5cf6"
        strokeWidth={2}
        dot={{ r: 2 }}
      />
      
    </LineChart>
  </ResponsiveContainer>
</div>
  );
}