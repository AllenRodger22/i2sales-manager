import React from 'react';
import { AnalysisResults } from '../types';
import IndividualView from './IndividualView';
import { ChartIcon } from './icons';

interface DashboardProps {
  analysisResults: AnalysisResults | null;
  selectedAgent: string | null;
  isLoading: boolean;
  hasData: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ analysisResults, selectedAgent, isLoading, hasData }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground dark:text-dark-muted-foreground">
          <svg className="animate-spin h-12 w-12 text-primary dark:text-dark-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg">Carregando dados para {selectedAgent}...</p>
        </div>
      );
    }

    if (!selectedAgent) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground dark:text-dark-muted-foreground bg-muted/50 dark:bg-dark-muted/50 rounded-lg">
                <ChartIcon className="w-20 h-20 text-border dark:text-dark-border mb-4" />
                <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">Painel i2Sales</h2>
                <p className="max-w-md">Selecione um corretor no painel à esquerda para começar a análise.</p>
            </div>
        );
    }
    
    if (!hasData) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground dark:text-dark-muted-foreground bg-muted/50 dark:bg-dark-muted/50 rounded-lg p-6">
            <ChartIcon className="w-20 h-20 text-border dark:text-dark-border mb-4" />
            <h2 className="text-2xl font-bold text-foreground dark:text-dark-foreground mb-2">Nenhum dado encontrado</h2>
            <p className="max-w-md">Não foram encontradas atividades para <span className="font-semibold text-primary">{selectedAgent}</span> no período selecionado. Tente ajustar as datas ou verifique se há registros para este corretor.</p>
        </div>
      );
    }

    if (selectedAgent && analysisResults?.individualMetrics) {
      return <IndividualView 
                agentName={selectedAgent} 
                metrics={analysisResults.individualMetrics} 
                events={analysisResults.filteredEvents || []}
             />;
    }

    return null; // Should not be reached due to the logic above
  };

  return <div className="w-full h-full">{renderContent()}</div>;
};

export default Dashboard;