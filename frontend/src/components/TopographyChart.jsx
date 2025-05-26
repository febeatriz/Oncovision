// src/components/TopographyChart.jsx
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const TopographyChart = ({ rawData }) => {
    const processedData = useMemo(() => {
        if (!rawData || rawData.length === 0) {
            return [];
        }
        const topographyDistribution = rawData.reduce((acc, paciente) => {
            const grupo = paciente.topogrup ? String(paciente.topogrup).trim() : "Não informado";
            if (!acc[grupo]) {
                acc[grupo] = 0;
            }
            acc[grupo]++;
            return acc;
        }, {});
        const sortedGrupos = Object.keys(topographyDistribution).sort();
        return sortedGrupos.map(grupo => ({
            name: grupo,
            quantidade: topographyDistribution[grupo]
        })).filter(item => item.name && item.name !== "null" && item.name !== "Não informado");
    }, [rawData]);

    if (!processedData.length) return null;

    return (
        <div style={{ width: '95%', height: 500, margin: 'auto', marginTop: '20px' }}>
            <h2>Distribuição de Pacientes por Grupo Topográfico</h2>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} style={{ fontSize: '10px' }} height={70} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
                    <Bar dataKey="quantidade" fill="#8884d8" name="Nº de Pacientes" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
export default TopographyChart;