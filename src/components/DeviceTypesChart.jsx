import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import ChartEmptyState from "./ChartEmptyState";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function DeviceTypesChart({ data = [] }) {
  const hasData = data.length > 0;

  return (
    <div className="chart-card">
      <h3>Device Types</h3>

      {!hasData ? (
        <ChartEmptyState message="No device type data available" />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={70}
              stroke="none"
              paddingAngle={0}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              labelLine={{ stroke: "#3b82f6" }}
            >
              {data.map((item, index) => (
                <Cell key={item.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              separator="       "
              itemStyle={{ color: "#000000" }}
              labelStyle={{ display: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
