import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FunnelData } from '../types';

interface FunnelChartProps {
  data: FunnelData;
  title?: string;
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data, title = "Funil de Vendas" }) => {
  const funnelData = [
    { name: 'Ligações', value: data.ligacoes, color: '#3B82F6' },
    { name: 'Atendimentos', value: data.atendimentos, color: '#10B981' },
    { name: 'Tratativas', value: data.tratativas, color: '#F59E0B' },
    { name: 'Documentações', value: data.documentacoes, color: '#EF4444' },
    { name: 'Vendas', value: data.vendas, color: '#8B5CF6' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Valor: {payload[0].value.toLocaleString('pt-BR')}
          </p>
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
            <BarChart
              data={funnelData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Ligação → Atendimento</div>
            <div className="text-lg font-semibold text-gray-900">
              {data.conversoes.ligacaoParaAtendimento}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Atendimento → Tratativa</div>
            <div className="text-lg font-semibold text-gray-900">
              {data.conversoes.atendimentoParaTratativa}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Tratativa → Documentação</div>
            <div className="text-lg font-semibold text-gray-900">
              {data.conversoes.tratativaParaDocumentacao}%
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Documentação → Venda</div>
            <div className="text-lg font-semibold text-gray-900">
              {data.conversoes.documentacaoParaVenda}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunnelChart;
