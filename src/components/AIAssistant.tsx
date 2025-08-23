import React, { useState } from 'react';
import { biService } from '../services/apiService';

interface AIAssistantProps {
  data: any;
  mode: string;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data, mode, onClose }) => {
  const [insights, setInsights] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateInsights = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await biService.getAIInsights(data, mode);
      setInsights(result.insights);
    } catch (err) {
      setError('Erro ao gerar insights. Verifique se a API do Gemini está configurada.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-6 w-11/12 md:w-3/4 lg:w-1/2 shadow-2xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mr-3">
              🤖
            </div>
            Ajudante do Gestor
          </h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent"></div>
            <span className="ml-3 text-white font-medium">Analisando dados...</span>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl p-6">
            <p className="text-red-200 mb-4">{error}</p>
            <button
              onClick={generateInsights}
              className="bg-red-500/90 hover:bg-red-600 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg border border-red-400/30"
            >
              Tentar Novamente
            </button>
          </div>
        ) : insights ? (
          <div className="max-h-96 overflow-y-auto bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <div className="prose prose-sm max-w-none text-white prose-headings:text-white prose-strong:text-white prose-p:text-white/90 prose-li:text-white/90">
              <div className="whitespace-pre-wrap">{insights}</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <button
              onClick={generateInsights}
              className="bg-orange-500/90 hover:bg-orange-600 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg border border-orange-400/30"
            >
              Gerar Insights com IA
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
