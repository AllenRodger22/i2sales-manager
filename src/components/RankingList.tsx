import React from 'react';
import { Trophy, Phone, FileText, CheckCircle } from 'lucide-react';
import { AgentRanking } from '../types';

interface RankingListProps {
  rankings: AgentRanking[];
}

const RankingList: React.FC<RankingListProps> = ({ rankings }) => {
  const getRankingIcon = (position: number) => {
    if (position === 0) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 1) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (position === 2) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="text-gray-500 font-medium">{position + 1}º</span>;
  };

  const getRankingBg = (position: number) => {
    if (position === 0) return 'bg-yellow-50 border-yellow-200';
    if (position === 1) return 'bg-gray-50 border-gray-200';
    if (position === 2) return 'bg-amber-50 border-amber-200';
    return 'bg-white border-gray-200';
  };

  const RankingCard = ({ title, icon, data, valueKey, label }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center mb-4">
          {icon}
          <h3 className="ml-2 text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
        </div>
        <div className="space-y-3">
          {data.slice(0, 5).map((agent: AgentRanking, index: number) => (
            <div
              key={agent.agentName}
              className={`flex items-center justify-between p-3 border rounded-lg ${getRankingBg(index)}`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                  {getRankingIcon(index)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {agent.agentName}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {(agent as any)[valueKey].toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <RankingCard
        title="Ranking de Vendas"
        icon={<Trophy className="h-6 w-6 text-green-600" />}
        data={[...rankings].sort((a, b) => b.totalVendas - a.totalVendas)}
        valueKey="totalVendas"
        label="vendas"
      />
      <RankingCard
        title="Ranking de Ligações"
        icon={<Phone className="h-6 w-6 text-blue-600" />}
        data={[...rankings].sort((a, b) => b.totalLigacoes - a.totalLigacoes)}
        valueKey="totalLigacoes"
        label="ligações"
      />
      <RankingCard
        title="Ranking de Documentações"
        icon={<FileText className="h-6 w-6 text-orange-600" />}
        data={[...rankings].sort((a, b) => b.documentacoes - a.documentacoes)}
        valueKey="documentacoes"
        label="documentações"
      />
      <RankingCard
        title="Ranking de Follow-ups"
        icon={<CheckCircle className="h-6 w-6 text-purple-600" />}
        data={[...rankings].sort((a, b) => b.followupsRealizados - a.followupsRealizados)}
        valueKey="followupsRealizados"
        label="follow-ups"
      />
    </div>
  );
};

export default RankingList;
