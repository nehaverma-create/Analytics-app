import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid
} from "recharts";

const data = [
  {
    country: "IN",
    visitors: 7,
  },
  {
    country: "US",
    visitors: 2,
  },
];

export default function TopCountriesChart() {
  return (
    <div className="chart-card">
      <h3>Top Countries</h3>

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
            dataKey="country"
            axisLine={false}
          />

          <Tooltip />

          <Bar
            dataKey="visitors"
            fill="#10B981"
            radius={[4, 4, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}