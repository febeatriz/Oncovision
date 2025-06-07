import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: any[] | null;
}

const TreatmentOutcomeChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    // Pega as chaves de resultado dinamicamente (excluindo 'tratamento')
    const outcomeKeys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== 'tratamento') : [];

    const colors = ["#82ca9d", "#ffc658", "#ff8042"];

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="tratamento" angle={-45} textAnchor="end" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    {outcomeKeys.map((key, index) => (
                        <Bar key={key} dataKey={key} stackId="a" fill={colors[index % colors.length]} />
                    ))}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TreatmentOutcomeChart;