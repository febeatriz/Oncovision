import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartProps {
    data: { tipo_cancer: string; quantidade: number }[] | null;
}

const MortalityByTypeChart = ({ data }: ChartProps) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground">Dados não disponíveis para este gráfico.</p>;
    }

    return (
        <div style={{ width: '100%', height: 350 }}> 
            <ResponsiveContainer>
                <BarChart 
                    data={data} 
                    margin={{ top: 5, right: 20, left: 10, bottom: 100 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    
                    <XAxis 
                        dataKey="tipo_cancer" 
                        angle={-45} 
                        textAnchor="end" 
                        height={90} 
                        interval={0} 
                        fontSize={12} 
                    />
                    
                    <YAxis allowDecimals={false} />
                    <Tooltip />                    
                    <Legend verticalAlign="top" />
                    
                    <Bar dataKey="quantidade" fill="#d00285" name="Nº de Óbitos" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MortalityByTypeChart;