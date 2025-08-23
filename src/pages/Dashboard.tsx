import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useDashboard } from '../contexts/DashboardContext';
import CSVUploader from '../components/CSVUploader';
import KpiCard from '../components/KpiCard';
import FunnelChart from '../components/FunnelChart';
import TemporalChart from '../components/TemporalChart';
import RankingList from '../components/RankingList';
import ComparativeKpiCard from '../components/ComparativeKpiCard';
import AIAssistant from '../components/AIAssistant';
import { LogOut, Bot } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    files, 
    analysisMode, 
    kpiData, 
    funnelData, 
    rankings, 
    generateAnalysis, 
    isLoading, 
    error 
  } = useDashboard();
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const handleAnalysisGeneration = async () => {
    try {
      await generateAnalysis();
    } catch (error) {
      console.error('Erro ao gerar análise:', error);
    }
  };

  const renderAnalysisContent = () => {
    if (!analysisMode) return null;

    switch (analysisMode.type) {
      case 'individual':
        return (
          <div className="space-y-6">
            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <KpiCard
                  title="Total de Vendas"
                  value={kpiData.totalVendas}
                  icon="💰"
                />
                <KpiCard
                  title="Média Ligações/Dia"
                  value={kpiData.mediaLigacoesDia}
                  icon="📞"
                />
                <KpiCard
                  title="Recorde de Ligações"
                  value={kpiData.recordeLigacoes}
                  icon="🏆"
                />
                <KpiCard
                  title="Follow-ups Realizados"
                  value={kpiData.followupsRealizados}
                  icon="✅"
                />
                <KpiCard
                  title="Follow-ups Futuros"
                  value={kpiData.followupsFuturos}
                  icon="📅"
                />
              </div>
            )}
            {funnelData && <FunnelChart data={funnelData} />}
            <TemporalChart data={files.find(f => f.type === 'produtividade')?.data || []} />
          </div>
        );

      case 'team':
        return (
          <div className="space-y-6">
            {rankings && <RankingList rankings={rankings} />}
            {funnelData && <FunnelChart data={funnelData} title="Funil Consolidado da Equipe" />}
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-600">Modo de análise não implementado ainda.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {analysisMode?.title || 'Dashboard de BI'}
              </h1>
              {analysisMode?.description && (
                <p className="text-gray-600 mt-1">{analysisMode.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Olá, {user?.name}
              </span>
              {files.length > 0 && (
                <button
                  onClick={() => setShowAIAssistant(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Ajudante do Gestor
                </button>
              )}
              <button
                onClick={logout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="mb-6 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {files.length === 0 ? (
            <CSVUploader />
          ) : (
            <div className="space-y-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Arquivos Carregados ({files.length})
                    </h3>
                    <button
                      onClick={handleAnalysisGeneration}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Gerando...' : 'Gerar Análise'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {file.agentName}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            file.type === 'produtividade' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {file.type}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{file.filename}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {renderAnalysisContent()}
            </div>
          )}
        </div>
      </main>

      {showAIAssistant && (
        <AIAssistant onClose={() => setShowAIAssistant(false)} />
      )}
    </div>
  );
};

export default Dashboard;
