export interface ProductivityData {
  Data: string;
  Ligações: number;
  CNE: number;
  'Contatos Efetivos': number;
  Tratativas: number;
  Documentação: number;
  Vendas: number;
}

export interface ClientData {
  'ID Cliente': string;
  Nome: string;
  Telefone: string;
  'E-mail': string;
  Origem: string;
  Status: string;
  'Data Cadastro': string;
  'Data Follow-up': string;
  Anexos: string; // JSON string
}

export interface ProductivitySet {
  period: {
    display: string;
    sortKey: string;
  };
  data: ProductivityData[];
}

export interface AgentData {
  name: string;
  productivitySets: ProductivitySet[];
  clients: ClientData[];
}

export enum AnalysisMode {
  Individual = 'individual',
  Team = 'team',
}

export interface Kpi {
  label: string;
  value: string;
}

export interface KpiComparison {
  label: string;
  currentValue: string;
  previousValue: string;
  changePercentage: number;
}

export interface FunnelStage {
  name: string;
  value: number;
  conversionRate?: number;
}

export interface TemporalMetric {
  date: string;
  [key: string]: number | string;
}

export interface IndividualAgentMetrics {
  kpis: Kpi[];
  funnel: FunnelStage[];
  temporalData: TemporalMetric[];
  isComparative: boolean;
  comparison?: {
     currentPeriod: string;
     previousPeriod: string;
     comparativeKpis: KpiComparison[];
  }
}

export interface RankingItem {
  name: string;
  value: number;
}

export interface TeamMetrics {
    salesRanking: RankingItem[];
    callsRanking: RankingItem[];
    docsRanking: RankingItem[];
    followUpsRanking: RankingItem[];
    consolidatedFunnel: FunnelStage[];
    teamTemporalData: TemporalMetric[];
    isComparative: boolean;
    comparison?: {
        currentPeriod: string;
        previousPeriod: string;
        comparativeKpis: KpiComparison[];
        previousConsolidatedFunnel: FunnelStage[];
    }
}


export interface AnalysisResults {
  individualMetrics: Record<string, IndividualAgentMetrics>;
  teamMetrics: TeamMetrics;
  agentNames: string[];
}