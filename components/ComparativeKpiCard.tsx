import React from 'react';
import { KpiComparison } from '../types';
import { ArrowUpIcon, ArrowDownIcon } from './icons';

interface ComparativeKpiCardProps {
  kpi: KpiComparison;
}

const ComparativeKpiCard: React.FC<ComparativeKpiCardProps> = ({ kpi }) => {
  const isPositive = kpi.changePercentage >= 0;
  const isInfinite = !isFinite(kpi.changePercentage);
  const changeColor = isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500';

  const formatPercentage = () => {
    if (isInfinite) return 'Novo';
    return `${isPositive ? '+' : ''}${kpi.changePercentage.toFixed(1)}%`;
  };

  return (
    <div className="bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm p-5 rounded-lg shadow-md flex flex-col justify-center border border-border dark:border-dark-border">
      <h4 className="text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground mb-1 truncate">{kpi.label}</h4>
      <p className="text-3xl font-bold text-foreground dark:text-dark-foreground">{kpi.currentValue}</p>
      <div className="flex items-center justify-start mt-2 text-sm">
        <div className={`flex items-center font-semibold ${changeColor}`}>
          {isPositive ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
          <span>{formatPercentage()}</span>
        </div>
        <p className="ml-2 text-muted-foreground dark:text-dark-muted-foreground">vs. {kpi.previousValue}</p>
      </div>
    </div>
  );
};

export default ComparativeKpiCard;