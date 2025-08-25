export enum AnalysisMode {
  Individual = 'individual',
  // Team = 'team', // Team mode is disabled for now
}

// Represents a single client from the processed CSV file
export interface ApiClient {
  _id: string;
  nome: string;
  corretor: string;
  historico: ApiHistoryItem[];
  valorVenda?: number;
}

// Represents a single item in a client's history, transformed from the CSV
export interface ApiHistoryItem {
  tipo: 'STATUS_CHANGE' | 'CALL' | 'NOTE';
  timestamp: string;
  de?: string;
  para?: string;
  resultado?: 'CE' | 'CNE';
  texto?: string;
}

// Represents the internal data structure used by the analysis hooks and components
export interface ClientEvent {
  clientId: string;
  timestamp: string; // ISO 8601 format
  type: 'STATUS_CHANGE' | 'CALL' | 'NOTE';
  details: {
    from?: string; // For STATUS_CHANGE
    to?: string; // For STATUS_CHANGE
    saleValue?: number; // For STATUS_CHANGE to 'Venda Gerada'
    result?: 'CE' | 'CNE'; // For CALL
    noteType?: 'Observação' | 'CNE'; // For NOTE
  };
}

export interface Kpi {
  label: string;
  value: string;
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
}

// Types for Team View components - These were missing
export interface RankingItem {
  name: string;
  value: number;
}

export interface KpiComparison {
  label: string;
  currentValue: string | number;
  previousValue: string | number;
  changePercentage: number;
}

export interface TeamMetrics {
  isComparative: boolean;
  comparison?: {
    currentPeriod: string;
    previousPeriod: string;
    comparativeKpis: KpiComparison[];
    previousConsolidatedFunnel: FunnelStage[];
  };
  consolidatedFunnel: FunnelStage[];
  salesRanking: RankingItem[];
  callsRanking: RankingItem[];
  docsRanking: RankingItem[];
  followUpsRanking: RankingItem[];
  teamTemporalData: TemporalMetric[];
}

export interface AnalysisResults {
  individualMetrics: IndividualAgentMetrics | null;
  teamMetrics?: TeamMetrics | null;
  filteredEvents?: ClientEvent[];
}