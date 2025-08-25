import React from 'react';
import { TeamMetrics } from '../types';
import FunnelChart from './FunnelChart';
import TemporalChart from './TemporalChart';
import RankingList from './RankingList';
import ComparativeKpiCard from './ComparativeKpiCard';

interface TeamViewProps {
  metrics: TeamMetrics;
}

const TeamView: React.FC<TeamViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-10">
      <h2 className="text-4xl font-bold text-foreground dark:text-dark-foreground">Painel: Análise de Equipe</h2>

      {metrics.isComparative && metrics.comparison && (
        <section className="p-6 bg-card/80 dark:bg-dark-card/50 backdrop-blur-sm border border-border dark:border-dark-border rounded-lg">
          <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-2">
             Análise Comparativa da Equipe
          </h3>
          <p className="text-sm text-muted-foreground dark:text-dark-muted-foreground mb-6">
            Comparando Período Atual ({metrics.comparison.currentPeriod}) vs. Período Anterior ({metrics.comparison.previousPeriod})
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.comparison.comparativeKpis.map(kpi => (
              <ComparativeKpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-3 text-center">Funil Consolidado (Atual)</h4>
              <FunnelChart data={metrics.consolidatedFunnel} />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-foreground dark:text-dark-foreground mb-3 text-center">Funil Consolidado (Anterior)</h4>
              <FunnelChart data={metrics.comparison.previousConsolidatedFunnel} />
            </div>
          </div>
           <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground mt-4 text-center">
            * As etapas de 'Tratativa' e 'Documentação' refletem os dados do arquivo de clientes mais recente.
          </p>
        </section>
      )}

      <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground pt-4">
        Rankings da Equipe (Período Atual)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RankingList title="Vendas" items={metrics.salesRanking} unit="Vendas" />
        <RankingList title="Ligações" items={metrics.callsRanking} unit="Ligações" />
        <RankingList title="Documentações" items={metrics.docsRanking} unit="Docs" />
        <RankingList title="Follow-ups" items={metrics.followUpsRanking} unit="Follow-ups" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
            <section>
                <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">Funil Consolidado</h3>
                <div className="p-6 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow">
                <FunnelChart data={metrics.consolidatedFunnel} />
                </div>
            </section>
        </div>
        <div className="lg:col-span-3">
          <section>
            <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">Ligações da Equipe</h3>
            <div className="p-4 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow h-96">
              <TemporalChart data={metrics.teamTemporalData} metrics={['Ligações']} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TeamView;