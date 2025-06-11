import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: any[] | null;
}

const GeneralTreatmentsChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    const sortedData = [...data].sort((a, b) => b.quantidade - a.quantidade);

    const barHeight = 40;
    const verticalMargins = 30;
    const chartHeight = sortedData.length * barHeight + verticalMargins;

    return (
        <div className="w-full" style={{ height: chartHeight }}>
            <ResponsiveContainer>
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 10, right: 30, left: 180, bottom: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis
                        dataKey="tratamento"
                        type="category"
                        width={170}
                        tick={{ fontSize: 12 }}
                        interval={0}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip cursor={{ fill: 'rgba(61, 3, 252, 0.1)' }} />
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                    <Bar
                        dataKey="quantidade"
                        name="Nº de Vezes Utilizado"
                        fill="#3d03fc"
                        barSize={20}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GeneralTreatmentsChart;