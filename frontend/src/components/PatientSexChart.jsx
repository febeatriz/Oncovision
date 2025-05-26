// src/components/PatientSexChart.jsx
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const PatientSexChart = ({ rawData }) => {
    const processedData = useMemo(() => {
        if (!rawData || rawData.length === 0) return [];
        const sexDistribution = rawData.reduce((acc, paciente) => {
            const sexo = paciente.sexo ? String(paciente.sexo).trim() : "Não Informado";
            if (!acc[sexo]) acc[sexo] = 0;
            acc[sexo]++;
            return acc;
        }, {});
        return Object.keys(sexDistribution).map(sexo => ({
            name: sexo,
            value: sexDistribution[sexo]
        })).filter(item => item.name && item.name !== "null" && item.name !== "Não Informado");
    }, [rawData]);

    if (!processedData.length) return null;

    return (
        <div style={{ width: '90%', height: 400, margin: '30px auto' }}>
            <h2>Distribuição de Pacientes por Sexo</h2>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={processedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {processedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} pacientes`} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
export default PatientSexChart;