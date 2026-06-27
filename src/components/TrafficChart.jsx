import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import ChartEmptyState from "./ChartEmptyState";

const formatDateLabel = (value) => {
  const date = new Date(`${value}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const TrafficChart = ({ data = [] }) => {
  const hasData = data.length > 0;

  return (
    <div className="traffic-chart-card">
      <h3 className="traffic-chart-title">Traffic over time</h3>

      {!hasData ? (
        <ChartEmptyState
          title="No data for this range"
          message="Adjust filters or wait for more traffic to appear."
          height={200}
        />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f2f4f7" />

            <XAxis
              dataKey="date"
              tickFormatter={formatDateLabel}
              axisLine={false}
              tickLine={false}
            />

            <YAxis axisLine={false} tickLine={false} allowDecimals={false} />

            <Tooltip
              labelFormatter={(label) => formatDateLabel(label)}
              formatter={(value, name) => [value, name]}
            />

            <Legend verticalAlign="bottom" height={36} />

            <Line
              type="monotone"
              dataKey="pageViews"
              name="Page views"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="visitors"
              name="Visitors"
              stroke="#14b8a6"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="sessions"
              name="Sessions"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default TrafficChart;
