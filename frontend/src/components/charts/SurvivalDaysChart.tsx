import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: { dias_sobrevida: number }[] | null;
}

const SurvivalDaysChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    const BUCKET_SIZE = 365; // Agrupar por ano
    const buckets = data.reduce((acc, item) => {
        const bucketIndex = Math.floor(item.dias_sobrevida / BUCKET_SIZE);
        const bucketLabel = `${bucketIndex * BUCKET_SIZE} - ${(bucketIndex + 1) * BUCKET_SIZE - 1} dias`;
        acc[bucketLabel] = (acc[bucketLabel] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const histogramData = Object.keys(buckets).map(key => ({
        faixa: key,
        quantidade: buckets[key],
    }));

    return (
        <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
                <BarChart data={histogramData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="faixa" />
                    <YAxis />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Bar dataKey="quantidade" fill="#0088FE" name="Nº de Pacientes" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SurvivalDaysChart;