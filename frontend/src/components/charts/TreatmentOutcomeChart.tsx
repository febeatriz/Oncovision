import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: any[] | null;
}

const TreatmentOutcomeChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    const outcomeKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'tratamento') : [];

    const colors = ["#82ca9d", "#ffc658", "#ff8042", "#8884d8", "#ff7300"];

    return (
        <div style={{ width: '100%', height: 450 }}> 
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 150 }}>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                        dataKey="tratamento"
                        angle={-45}
                        textAnchor="end"
                        interval={0}
                        height={60} 
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" />

                    {outcomeKeys.map((key, index) => (
                        <Line
                            key={key}
                            type="monotone"
                            dataKey={key}
                            name={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            stroke={colors[index % colors.length]}
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            dot={{ r: 4, strokeWidth: 2 }} 
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TreatmentOutcomeChart;