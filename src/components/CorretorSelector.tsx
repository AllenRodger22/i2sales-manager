import React, { useState, useEffect } from 'react';
import { userService, corretorService } from '../services/apiService';

interface Corretor {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CorretorSelectorProps {
  onCorretorSelect: (corretorId: string, analysis: any) => void;
  onTeamSelect: (teamData: any) => void;
}

const CorretorSelector: React.FC<CorretorSelectorProps> = ({ onCorretorSelect, onTeamSelect }) => {
  const [corretores, setCorretores] = useState<Corretor[]>([]);
  const [selectedCorretor, setSelectedCorretor] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCorretores = async () => {
      try {
        const data = await userService.getCorretores();
        setCorretores(data);
      } catch (error) {
        console.error('Erro ao buscar corretores:', error);
      }
    };
    fetchCorretores();
  }, []);

  const handleCorretorChange = async (corretorId: string) => {
    setSelectedCorretor(corretorId);
    if (corretorId === 'team') {
      setLoading(true);
      try {
        const teamData = await corretorService.getTeamAnalysis();
        onTeamSelect(teamData);
      } catch (error) {
        console.error('Erro ao buscar análise da equipe:', error);
      } finally {
        setLoading(false);
      }
    } else if (corretorId) {
      setLoading(true);
      try {
        const analysis = await corretorService.getCorretorAnalysis(corretorId);
        onCorretorSelect(corretorId, analysis);
      } catch (error) {
        console.error('Erro ao buscar análise do corretor:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mb-8">
      <label htmlFor="corretor-select" className="block text-sm font-medium text-white/90 mb-3">
        Selecionar Corretor ou Equipe
      </label>
      <div className="relative">
        <select
          id="corretor-select"
          value={selectedCorretor}
          onChange={(e) => handleCorretorChange(e.target.value)}
          className="block w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-white appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <option value="" className="bg-gray-800 text-white">Selecione um corretor ou equipe</option>
          <option value="team" className="bg-gray-800 text-white">📊 Análise da Equipe</option>
          {corretores.map((corretor) => (
            <option key={corretor.id} value={corretor.id} className="bg-gray-800 text-white">
              👤 {corretor.name} ({corretor.email})
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {loading && (
        <div className="mt-3 flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
          <span className="text-sm text-white/70">Carregando dados...</span>
        </div>
      )}
    </div>
  );
};

export default CorretorSelector;
