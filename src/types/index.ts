export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'manager' | 'admin';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface CSVFileInfo {
  type: 'produtividade' | 'clientes';
  agentName: string;
  startDate?: Date;
  endDate?: Date;
  description?: string;
  data: any[];
  filename: string;
}

export interface KPIData {
  totalVendas: number;
  mediaLigacoesDia: number;
  recordeLigacoes: number;
  followupsRealizados: number;
  followupsFuturos: number;
}

export interface FunnelData {
  ligacoes: number;
  atendimentos: number;
  tratativas: number;
  documentacoes: number;
  vendas: number;
  conversoes: {
    ligacaoParaAtendimento: number;
    atendimentoParaTratativa: number;
    tratativaParaDocumentacao: number;
    documentacaoParaVenda: number;
  };
}

export interface AgentRanking {
  agentName: string;
  totalVendas: number;
  totalLigacoes: number;
  documentacoes: number;
  followupsRealizados: number;
}

export interface AnalysisMode {
  type: 'individual' | 'individual-comparative' | 'team' | 'team-comparative';
  title: string;
  description: string;
}

export interface DashboardContextType {
  files: CSVFileInfo[];
  analysisMode: AnalysisMode | null;
  kpiData: KPIData | null;
  funnelData: FunnelData | null;
  rankings: AgentRanking[] | null;
  uploadFiles: (files: FileList) => Promise<void>;
  generateAnalysis: () => Promise<void>;
  generateAIInsights: () => Promise<string>;
  isLoading: boolean;
  error: string | null;
}
