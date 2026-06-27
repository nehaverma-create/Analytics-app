import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import ChartEmptyState from "./ChartEmptyState";

export default function TopBrowsersChart({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <div className="chart-card">
      <h3>Top Browsers</h3>

      {!hasData ? (
        <ChartEmptyState message="No browser data available" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              horizontal={false}
              vertical={true}
              stroke="#f2f4f7"
            />

            <XAxis type="number" axisLine={false} tickLine={false} />

            <YAxis
              type="category"
              dataKey="browser"
              axisLine={false}
              width={80}
            />

            <Tooltip />

            <Bar dataKey="value" fill="#ff6b00" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
