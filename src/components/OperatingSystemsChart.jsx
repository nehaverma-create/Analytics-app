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
    os: "Linux",
    users: 9,
  },
];

export default function OperatingSystemsChart() {
  return (
    <div className="chart-card">
      <h3>Operating Systems</h3>

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
            tickLine={false} 
          />

          <YAxis
            type="category"
            dataKey="os"
            axisLine={false}
          />

          <Tooltip />

          <Bar
            dataKey="users"
            fill="#8B5CF6"
            radius={[4, 4, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}