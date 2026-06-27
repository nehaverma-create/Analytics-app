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

export default function OperatingSystemsChart({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <div className="chart-card">
      <h3>Operating Systems</h3>

      {!hasData ? (
        <ChartEmptyState message="No OS data available" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid
              horizontal={false}
              vertical={true}
              stroke="#f2f4f7"
            />

            <XAxis type="number" axisLine={false} tickLine={false} />

            <YAxis type="category" dataKey="os" axisLine={false} width={80} />

            <Tooltip />

            <Bar dataKey="users" fill="#8B5CF6" radius={[4, 4, 4, 4]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
