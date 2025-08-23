import React from 'react';
import { IndividualAgentMetrics } from '../types';
import KpiCard from './KpiCard';
import FunnelChart from './FunnelChart';
import TemporalChart from './TemporalChart';
import ComparativeKpiCard from './ComparativeKpiCard';

interface IndividualViewProps {
  agentName: string;
  metrics: IndividualAgentMetrics;
}

const IndividualView: React.FC<IndividualViewProps> = ({ agentName, metrics }) => {
  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-bold text-foreground dark:text-dark-foreground">Painel: <span className="text-primary">{agentName}</span></h2>

      <section>
        <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">
          Métricas Chave {metrics.isComparative ? `(${metrics.comparison?.currentPeriod})` : ''}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {metrics.kpis.map(kpi => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>
      </section>

      {metrics.isComparative && metrics.comparison && (
        <section>
          <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">
            Análise Comparativa
          </h3>
          <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground mb-4">
            {metrics.comparison.currentPeriod} vs. {metrics.comparison.previousPeriod}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.comparison.comparativeKpis.map(kpi => (
              <ComparativeKpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <section>
            <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">Funil de Vendas</h3>
            <div className="p-6 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow">
              <FunnelChart data={metrics.funnel} />
            </div>
          </section>
        </div>

        <div className="lg:col-span-2">
          <section>
            <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">Produtividade Temporal</h3>
            <div className="p-4 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow h-96">
              <TemporalChart data={metrics.temporalData} metrics={['Ligações', 'Contatos Efetivos', 'Vendas']} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IndividualView;