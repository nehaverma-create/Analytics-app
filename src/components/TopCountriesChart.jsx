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

export default function TopCountriesChart({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <div className="chart-card">
      <h3>Top Countries</h3>

      {!hasData ? (
        <ChartEmptyState message="No country data available" />
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
              dataKey="country"
              axisLine={false}
              width={40}
            />

            <Tooltip />

            <Bar dataKey="visitors" fill="#10B981" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
