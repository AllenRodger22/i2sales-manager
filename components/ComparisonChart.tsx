import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
  data: any[];
}

const COLORS = {
  'Vendas': 'hsl(25 95% 53%)',
  'Contatos Efetivos': 'hsl(0 0% 75%)',
};

const DARK_COLORS = {
    'Vendas': 'hsl(25 95% 53%)',
    'Contatos Efetivos': 'hsl(0 0% 30%)',
};


const ComparisonChart: React.FC<ComparisonChartProps> = ({ data }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const chartColors = isDarkMode ? DARK_COLORS : COLORS;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'hsl(0 0% 18%)': 'hsl(0 0% 92%)'} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'currentColor' }} stroke={isDarkMode ? 'hsl(0 0% 63.9%)' : 'hsl(0 0% 45.1%)'}/>
        <YAxis yAxisId="left" orientation="left" stroke={chartColors['Contatos Efetivos']} tick={{ fontSize: 12, fill: 'currentColor' }} />
        <YAxis yAxisId="right" orientation="right" stroke={chartColors['Vendas']} tick={{ fontSize: 12, fill: 'currentColor' }} />
        <Tooltip 
             contentStyle={{
                backgroundColor: isDarkMode ? 'hsl(0 0% 12%)' : 'hsl(0 0% 100%)',
                borderColor: isDarkMode ? 'hsl(0 0% 18%)' : 'hsl(0 0% 92%)',
                borderRadius: '0.75rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
            }}
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
        />
        <Legend wrapperStyle={{fontSize: "14px"}} />
        <Bar yAxisId="left" dataKey="Contatos Efetivos" fill={chartColors['Contatos Efetivos']} radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="Vendas" fill={chartColors['Vendas']} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ComparisonChart;