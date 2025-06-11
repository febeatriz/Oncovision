import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: { Idade: string; quantidade: number }[] | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF6666'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent * 100 < 5) {
        return null;
    }

    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const MortalityByAgeChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    return (
        <div style={{ width: '100%', height: 400 }}> 
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="quantidade"
                        nameKey="Idade"
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={150}
                        fill="#8884d8"
                    >
                        {/* 4. Mapear os dados para criar uma Cell com uma cor para cada fatia */}
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MortalityByAgeChart;