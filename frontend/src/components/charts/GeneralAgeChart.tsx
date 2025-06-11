import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: any[] | null;
}

const GeneralAgeChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="Idade" />
                    <YAxis />
                    <Tooltip cursor={{ fill: 'rgba(252, 3, 252, 0.1)' }} />
                    <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: '10px' }} />
                    <Bar dataKey="quantidade" name="Nº de Casos" fill="#fc03fc" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default GeneralAgeChart;