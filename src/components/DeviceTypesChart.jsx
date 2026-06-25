import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "desktop",
    value: 9, 
  },
];

const COLORS = ["#3b82f6"];

export default function DeviceTypesChart() {
  return (
    <div className="chart-card">
      <h3>Device Types</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={70}
            stroke="none"      
            paddingAngle={0}  
            label={({ name, percent }) =>
              `${name.toLowerCase()} ${(percent * 100).toFixed(0)}%`
            }
            labelLine={{ stroke: "#3b82f6" }} // Blue connector line
          >
            {data.map((item, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip 
            separator="       "
            itemStyle={{ color: "#000000" }}
            labelStyle={{ display: "none" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
