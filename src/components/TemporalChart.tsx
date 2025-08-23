import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TemporalChartProps {
  data: any[];
  title?: string;
}

const TemporalChart: React.FC<TemporalChartProps> = ({ data, title = "Produtividade Temporal" }) => {
  const chartData = data.map(item => ({
    data: new Date(item.data).toLocaleDateString('pt-BR'),
    ligacoes: item.ligacoes,
    vendas: item.vendas,
    contatosEfetivos: item.contatosEfetivos,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          {title}
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ligacoes" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="Ligações"
              />
              <Line 
                type="monotone" 
                dataKey="vendas" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Vendas"
              />
              <Line 
                type="monotone" 
                dataKey="contatosEfetivos" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="Contatos Efetivos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TemporalChart;
