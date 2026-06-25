import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  
} from "recharts";



const trafficData = [
  { name: "Direct", value: 44 },
  { name: "Other", value: 56 },
];

const COLORS = ["#F5A000", "#E84393"];

export default function TafficSources() {
  return (
    <div className="chartCard">
      <h3 className="chartTitle">Traffic Sources</h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={trafficData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}%`}
          >
            {trafficData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}