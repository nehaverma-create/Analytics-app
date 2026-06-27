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

export default function TopPages({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <div className="chart-card">
      <h3>Top Pages</h3>

      {!hasData ? (
        <ChartEmptyState message="No page data available" />
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
              dataKey="views"
              axisLine={false}
              width={120}
            />

            <Tooltip />

            <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
