import React, { useState } from 'react';
import { IndividualAgentMetrics, ClientEvent } from '../types';
import KpiCard from './KpiCard';
import FunnelChart from './FunnelChart';
import TemporalChart from './TemporalChart';
import RecentActivity from './RecentActivity';

interface IndividualViewProps {
  agentName: string;
  metrics: IndividualAgentMetrics;
  events: ClientEvent[];
}

const IndividualView: React.FC<IndividualViewProps> = ({ agentName, metrics, events }) => {
  const chartMetrics = ['Ligações', 'Contatos Efetivos', 'Vendas'];
  const [visibleMetrics, setVisibleMetrics] = useState<string[]>(['Ligações', 'Vendas']);

  const toggleMetric = (metric: string) => {
      setVisibleMetrics(prev => 
          prev.includes(metric) ? prev.filter(m => m !== metric) : [...prev, metric]
      );
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-4xl font-bold text-foreground dark:text-dark-foreground">Painel: <span className="text-primary">{agentName}</span></h2>
      </div>

      <section>
        <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">
          Métricas Chave
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.kpis.map(kpi => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4">
                <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground">Produtividade Temporal</h3>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                    {chartMetrics.map(metric => (
                        <label key={metric} className="flex items-center space-x-2 cursor-pointer text-sm">
                            <input
                                type="checkbox"
                                checked={visibleMetrics.includes(metric)}
                                onChange={() => toggleMetric(metric)}
                                className="h-4 w-4 rounded text-primary focus:ring-primary border-border dark:border-dark-border bg-card dark:bg-dark-card focus:ring-offset-0"
                            />
                            <span>{metric}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="p-4 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow h-96">
              <TemporalChart data={metrics.temporalData} metrics={visibleMetrics} />
            </div>
        </section>

        <section>
            <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">Funil de Vendas</h3>
            <div className="p-6 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow">
              <FunnelChart data={metrics.funnel} />
            </div>
        </section>
      </div>

      <RecentActivity events={events} />
    </div>
  );
};

export default IndividualView;