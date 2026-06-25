import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

const data = [
  {
    browser: "Chrome",
    value: 9,
  },
];

export default function TopBrowsersChart() {
  return (
    <div className="chart-card">
      <h3>Top Browsers</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
          layout="vertical"
        >
          <CartesianGrid
            horizontal={false}
            vertical={true}
            stroke="#f2f4f7"
          />

          <XAxis type="number"
          axisLine={false}
          tickLine={false}  />

          <YAxis
            type="category"
            dataKey="browser"
            axisLine={false}
          />

          <Tooltip />

          <Bar
            dataKey="value"
            fill="#ff6b00"
            radius={[4, 4, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}