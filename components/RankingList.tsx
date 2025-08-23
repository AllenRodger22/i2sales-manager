import React from 'react';
import { TrophyIcon } from './icons';
import { RankingItem } from '../types';

interface RankingListProps {
  title: string;
  items: RankingItem[];
  unit: string;
}

const RankingList: React.FC<RankingListProps> = ({ title, items, unit }) => {
  return (
    <section>
      <h3 className="text-xl font-semibold text-foreground dark:text-dark-foreground mb-4">{title}</h3>
      <div className="p-4 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow min-h-[200px] border border-border dark:border-dark-border">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={item.name} className="flex items-center justify-between p-3 rounded-md transition-colors hover:bg-muted dark:hover:bg-dark-muted">
              <div className="flex items-center gap-3">
                <span className={`font-bold text-lg w-6 text-center ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-slate-500 dark:text-slate-400' : index === 2 ? 'text-amber-700' : 'text-muted-foreground dark:text-dark-muted-foreground'}`}>{index + 1}</span>
                {index < 3 && <TrophyIcon className={`h-5 w-5 ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-400' : 'text-amber-600'}`} />}
                <span className="font-medium text-foreground dark:text-dark-foreground">{item.name}</span>
              </div>
              <span className="font-semibold text-primary dark:text-dark-primary">{item.value.toLocaleString()} <span className="text-xs text-muted-foreground dark:text-dark-muted-foreground">{unit}</span></span>
            </li>
          ))}
          {items.length === 0 && (
            <li className="text-center text-muted-foreground dark:text-dark-muted-foreground py-4">Nenhum dado disponível.</li>
          )}
        </ul>
      </div>
    </section>
  );
};

export default RankingList;