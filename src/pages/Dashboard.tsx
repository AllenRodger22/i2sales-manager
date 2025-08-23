import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CorretorSelector from '../components/CorretorSelector';
import KpiCard from '../components/KpiCard';
import RankingList from '../components/RankingList';
import AIAssistant from '../components/AIAssistant';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analysisMode, setAnalysisMode] = useState<string>('');
  const [showAI, setShowAI] = useState(false);

  const handleCorretorSelect = (corretorId: string, analysis: any) => {
    setAnalysisData({
      type: 'individual',
      corretorId,
      data: analysis
    });
    setAnalysisMode('individual');
  };

  const handleTeamSelect = (teamData: any) => {
    setAnalysisData({
      type: 'team',
      data: teamData
    });
    setAnalysisMode('team');
  };

  const renderIndividualAnalysis = () => {
    if (!analysisData || analysisData.type !== 'individual') return null;
    
    const { data } = analysisData;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Total de Clientes"
            value={data.totalClientes}
            icon="👥"
          />
          <KpiCard
            title="Tratativas"
            value={data.statusCounts.tratativas}
            icon="💼"
          />
          <KpiCard
            title="Documentações"
            value={data.statusCounts.documentacoes}
            icon="📄"
          />
          <KpiCard
            title="Vendas"
            value={data.statusCounts.vendas}
            icon="💰"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KpiCard
            title="Follow-ups Realizados"
            value={data.followupsRealizados}
            icon="✅"
          />
          <KpiCard
            title="Follow-ups Futuros"
            value={data.followupsFuturos}
            icon="📅"
          />
        </div>
      </div>
    );
  };

  const renderTeamAnalysis = () => {
    if (!analysisData || analysisData.type !== 'team') return null;
    
    const { data } = analysisData;
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RankingList
            title="Ranking de Vendas"
            data={data.map((corretor: any) => ({
              name: corretor.nome,
              value: corretor.statusCounts.vendas
            }))}
            icon="🏆"
          />
          <RankingList
            title="Ranking de Clientes"
            data={data.map((corretor: any) => ({
              name: corretor.nome,
              value: corretor.totalClientes
            }))}
            icon="👥"
          />
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%"><stop offset="0%" stop-color="%23667eea"/><stop offset="100%" stop-color="%23764ba2"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23a)"/><g opacity="0.1"><circle cx="200" cy="200" r="100" fill="white"/><circle cx="800" cy="300" r="150" fill="white"/><circle cx="400" cy="700" r="120" fill="white"/><circle cx="700" cy="800" r="80" fill="white"/></g></svg>')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
      
      <div className="relative z-10">
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">i2</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Dashboard de BI</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-white/90 font-medium">Olá, {user?.name}</span>
                <button
                  onClick={() => setShowAI(true)}
                  className="bg-orange-500/90 hover:bg-orange-600 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg border border-orange-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!analysisData}
                >
                  🤖 Ajudante do Gestor
                </button>
                <button
                  onClick={logout}
                  className="bg-red-500/90 hover:bg-red-600 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg border border-red-400/30"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl p-8">
            <CorretorSelector
              onCorretorSelect={handleCorretorSelect}
              onTeamSelect={handleTeamSelect}
            />
            
            {analysisMode === 'individual' && renderIndividualAnalysis()}
            {analysisMode === 'team' && renderTeamAnalysis()}
            
            {!analysisData && (
              <div className="text-center py-16">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-8 border border-white/30">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <p className="text-white text-xl font-medium">
                    Selecione um corretor ou a equipe para visualizar os dados de BI
                  </p>
                  <p className="text-white/70 mt-2">
                    Os dados são carregados automaticamente do banco de dados
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {showAI && analysisData && (
          <AIAssistant
            data={analysisData.data}
            mode={analysisMode}
            onClose={() => setShowAI(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
