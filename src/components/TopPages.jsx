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
        views: "/",
        users: 9,
    },
];

export default function TopPages() {
    return (
        <div className="chart-card">
            <h3>Top Pages</h3>

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
                        dataKey="views"
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