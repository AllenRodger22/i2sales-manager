import React from 'react';
import { AnalysisMode, AnalysisResults } from '../types';
import IndividualView from './IndividualView';
import TeamView from './TeamView';
import { ChartIcon } from './icons';

interface DashboardProps {
  analysisMode: AnalysisMode;
  analysisResults: AnalysisResults;
  selectedAgent: string | null;
  isLoading: boolean;
  hasData: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisMode, analysisResults, selectedAgent, isLoading, hasData }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground dark:text-dark-muted-foreground">
          <svg className="animate-spin h-12 w-12 text-primary dark:text-dark-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Analisando dados...</p>
        </div>
      );
    }

    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground dark:text-dark-muted-foreground bg-muted/50 dark:bg-dark-muted/50 rounded-lg">
            <ChartIcon className="w-20 h-20 text-border dark:text-dark-border mb-4" />
            <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">Painel i2Sales</h2>
            <p className="max-w-md">Para começar, carregue os arquivos de produtividade e de clientes (CSV) usando o painel à esquerda.</p>
        </div>
      );
    }

    if (analysisMode === AnalysisMode.Individual && selectedAgent) {
      const agentMetrics = analysisResults.individualMetrics[selectedAgent];
      if (agentMetrics) {
        return <IndividualView agentName={selectedAgent} metrics={agentMetrics} />;
      }
    }

    if (analysisMode === AnalysisMode.Team) {
        if (analysisResults.agentNames.length < 2) {
             return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground dark:text-dark-muted-foreground">
                    <p>Carregue os dados de pelo menos dois agentes para usar a Análise de Equipe.</p>
                </div>
            );
        }
      return <TeamView metrics={analysisResults.teamMetrics} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground dark:text-dark-muted-foreground">
            <p>Selecione um agente para visualizar seu painel individual.</p>
        </div>
    );
  };

  return <div className="w-full h-full">{renderContent()}</div>;
};

export default Dashboard;