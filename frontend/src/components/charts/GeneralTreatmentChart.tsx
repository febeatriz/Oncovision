import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: any[] | null;
}

const GeneralTreatmentsChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    // Ordena os dados para exibir os mais frequentes no topo
    const sortedData = [...data].sort((a, b) => b.quantidade - a.quantidade);

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis
                        dataKey="tratamento"
                        type="category"
                        width={150} // Aumenta o espaço para os nomes dos tratamentos
                        tick={{ fontSize: 12 }}
                    />
                    <Tooltip cursor={{ fill: 'rgba(61, 3, 252, 0.1)' }} />
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                    <Bar dataKey="quantidade" name="Nº de Vezes Utilizado" fill="#3d03fc" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GeneralTreatmentsChart;