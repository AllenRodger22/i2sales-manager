import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CSVFileInfo, AnalysisMode, KPIData, FunnelData, AgentRanking, DashboardContextType } from '../types';
import { biService } from '../services/apiService';

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [files, setFiles] = useState<CSVFileInfo[]>([]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode | null>(null);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);
  const [rankings, setRankings] = useState<AgentRanking[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const determineAnalysisMode = (processedFiles: CSVFileInfo[]): AnalysisMode => {
    const agents = [...new Set(processedFiles.map(f => f.agentName))];
    const produtividadeFiles = processedFiles.filter(f => f.type === 'produtividade');
    
    const isTeam = agents.length > 1;
    const hasMultiplePeriods = agents.some(agent => 
      produtividadeFiles.filter(f => f.agentName === agent).length > 1
    );

    if (isTeam) {
      return {
        type: hasMultiplePeriods ? 'team-comparative' : 'team',
        title: hasMultiplePeriods ? 'Análise de Equipe (Comparativa)' : 'Análise de Equipe',
        description: hasMultiplePeriods 
          ? 'Comparação de performance da equipe entre períodos'
          : 'Performance consolidada da equipe'
      };
    } else {
      return {
        type: hasMultiplePeriods ? 'individual-comparative' : 'individual',
        title: hasMultiplePeriods ? `Análise Individual (Comparativa): ${agents[0]}` : `Análise Individual: ${agents[0]}`,
        description: hasMultiplePeriods
          ? 'Comparação de performance entre períodos'
          : 'Performance do período selecionado'
      };
    }
  };

  const uploadFiles = async (fileList: FileList) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await biService.uploadCSV(fileList);
      const processedFiles: CSVFileInfo[] = response.files;
      
      setFiles(processedFiles);
      setAnalysisMode(determineAnalysisMode(processedFiles));
    } catch (error) {
      setError('Erro ao processar arquivos CSV');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const generateAnalysis = async () => {
    if (!analysisMode || files.length === 0) return;

    try {
      setIsLoading(true);
      setError(null);

      const analysisData = prepareAnalysisData();
      const result = await biService.getAnalysis(analysisMode.type, analysisData);

      if (analysisMode.type === 'individual') {
        setKpiData(result);
      } else if (analysisMode.type.includes('team')) {
        setRankings(result.rankings?.vendas || []);
        setFunnelData(result.funnel);
      }
    } catch (error) {
      setError('Erro ao gerar análise');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const prepareAnalysisData = () => {
    const agents = [...new Set(files.map(f => f.agentName))];
    
    if (analysisMode?.type === 'individual') {
      const agent = agents[0];
      const produtividade = files.find(f => f.agentName === agent && f.type === 'produtividade')?.data || [];
      const clientes = files.find(f => f.agentName === agent && f.type === 'clientes')?.data || [];
      
      return { produtividade, clientes };
    } else if (analysisMode?.type.includes('team')) {
      const agentsData = agents.map(agent => {
        const produtividade = files.find(f => f.agentName === agent && f.type === 'produtividade')?.data || [];
        const clientes = files.find(f => f.agentName === agent && f.type === 'clientes')?.data || [];
        
        return {
          agentName: agent,
          totalVendas: produtividade.reduce((sum: number, day: any) => sum + (day.vendas || 0), 0),
          totalLigacoes: produtividade.reduce((sum: number, day: any) => sum + (day.ligacoes || 0), 0),
          documentacoes: clientes.filter((c: any) => c.status?.includes('Documentação')).length,
          followupsRealizados: clientes.filter((c: any) => 
            c.data_followup && new Date(c.data_followup) <= new Date()
          ).length,
        };
      });
      
      return { agents: agentsData };
    }
    
    return {};
  };

  const generateAIInsights = async (): Promise<string> => {
    if (!analysisMode) throw new Error('Nenhuma análise disponível');

    try {
      setIsLoading(true);
      const analysisData = prepareAnalysisData();
      const response = await biService.getAIInsights(analysisData, analysisMode.type);
      return response.insights;
    } catch (error) {
      throw new Error('Erro ao gerar insights de IA');
    } finally {
      setIsLoading(false);
    }
  };

  const value: DashboardContextType = {
    files,
    analysisMode,
    kpiData,
    funnelData,
    rankings,
    uploadFiles,
    generateAnalysis,
    generateAIInsights,
    isLoading,
    error,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
