import React from 'react';

interface RankingItem {
  name: string;
  value: number;
}

interface RankingListProps {
  title: string;
  data: RankingItem[];
  icon: string;
}

const RankingList: React.FC<RankingListProps> = ({ title, data, icon }) => {
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  const getTrophyIcon = (index: number) => {
    switch (index) {
      case 0: return '🥇';
      case 1: return '🥈';
      case 2: return '🥉';
      default: return '🏅';
    }
  };

  const getRankingGradient = (index: number) => {
    switch (index) {
      case 0: return 'from-yellow-400 to-yellow-600';
      case 1: return 'from-gray-300 to-gray-500';
      case 2: return 'from-orange-400 to-orange-600';
      default: return 'from-blue-400 to-blue-600';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/20">
      <div className="px-6 py-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-lg">{icon}</span>
          </div>
          <h3 className="text-lg leading-6 font-bold text-white">
            {title}
          </h3>
        </div>
        
        <div className="space-y-3">
          {sortedData.map((item, index) => (
            <div 
              key={item.name} 
              className={`flex items-center justify-between p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-200 ${
                index < 3 ? 'ring-2 ring-orange-400/30' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 bg-gradient-to-br ${getRankingGradient(index)} rounded-lg flex items-center justify-center`}>
                  <span className="text-sm font-bold text-white">#{index + 1}</span>
                </div>
                <span className="text-xl">{getTrophyIcon(index)}</span>
                <div>
                  <p className="text-sm font-medium text-white">
                    {item.name}
                  </p>
                  <p className="text-xs text-white/60">
                    Posição {index + 1}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  {item.value.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {sortedData.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-white/70">
              Nenhum dado disponível
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingList;
