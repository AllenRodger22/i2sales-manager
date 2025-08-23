import React from 'react';
import { Kpi } from '../types';

interface KpiCardProps {
  kpi: Kpi;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  return (
    <div className="bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm p-5 rounded-lg shadow-md flex flex-col justify-center text-center border border-border dark:border-dark-border">
      <h4 className="text-sm font-medium text-muted-foreground dark:text-dark-muted-foreground mb-2 truncate">{kpi.label}</h4>
      <p className="text-3xl font-bold text-foreground dark:text-dark-foreground">{kpi.value}</p>
    </div>
  );
};

export default KpiCard;