import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import ChartEmptyState from "./ChartEmptyState";

const COLORS = ["#E84393", "#F5A000"];

export default function TrafficSources({ data = [] }) {
  const hasData = data.some((item) => item.value > 0);

  return (
    <div className="chart-card">
      <h3>Traffic Sources</h3>

      {!hasData ? (
        <ChartEmptyState message="No referrer data available" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name} ${value}%`}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
