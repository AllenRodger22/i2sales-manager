import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ComparativeKpiCardProps {
  title: string;
  current: number;
  previous: number;
  change: number;
  icon: string;
  unit?: string;
}

const ComparativeKpiCard: React.FC<ComparativeKpiCardProps> = ({
  title,
  current,
  previous,
  change,
  icon,
  unit = ''
}) => {
  const isPositive = change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const bgColor = isPositive ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {current.toLocaleString('pt-BR')}{unit}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${trendColor}`}>
                  <TrendIcon className="self-center flex-shrink-0 h-4 w-4" />
                  <span className="ml-1">
                    {Math.abs(change)}%
                  </span>
                </div>
              </dd>
              <dd className="text-sm text-gray-600">
                Anterior: {previous.toLocaleString('pt-BR')}{unit}
              </dd>
            </dl>
          </div>
        </div>
        <div className={`mt-3 px-3 py-1 rounded-full text-xs font-medium ${bgColor} ${trendColor}`}>
          {isPositive ? 'Crescimento' : 'Queda'} de {Math.abs(change)}% vs período anterior
        </div>
      </div>
    </div>
  );
};

export default ComparativeKpiCard;
