import React, { useState } from 'react';
import { useDashboard } from '../contexts/DashboardContext';
import { X, Bot, Loader, AlertCircle, CheckCircle, TrendingUp, Target } from 'lucide-react';

interface AIAssistantProps {
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ onClose }) => {
  const { generateAIInsights, isLoading } = useDashboard();
  const [insights, setInsights] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerateInsights = async () => {
    try {
      setError('');
      const result = await generateAIInsights();
      setInsights(result);
    } catch (err) {
      setError('Erro ao gerar insights. Verifique se a API do Gemini está configurada.');
    }
  };

  const formatInsights = (text: string) => {
    const sections = text.split('##').filter(section => section.trim());
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const title = lines[0].trim();
      const content = lines.slice(1).join('\n').trim();
      
      let icon = <Bot className="h-5 w-5" />;
      let bgColor = 'bg-blue-50';
      let textColor = 'text-blue-800';
      
      if (title.toLowerCase().includes('positivo') || title.toLowerCase().includes('destaque')) {
        icon = <CheckCircle className="h-5 w-5" />;
        bgColor = 'bg-green-50';
        textColor = 'text-green-800';
      } else if (title.toLowerCase().includes('atenção') || title.toLowerCase().includes('problema')) {
        icon = <AlertCircle className="h-5 w-5" />;
        bgColor = 'bg-yellow-50';
        textColor = 'text-yellow-800';
      } else if (title.toLowerCase().includes('ações') || title.toLowerCase().includes('sugeridas')) {
        icon = <Target className="h-5 w-5" />;
        bgColor = 'bg-purple-50';
        textColor = 'text-purple-800';
      } else if (title.toLowerCase().includes('resumo')) {
        icon = <TrendingUp className="h-5 w-5" />;
        bgColor = 'bg-gray-50';
        textColor = 'text-gray-800';
      }
      
      return (
        <div key={index} className={`${bgColor} rounded-lg p-4 mb-4`}>
          <div className={`flex items-center mb-2 ${textColor}`}>
            {icon}
            <h3 className="ml-2 text-lg font-semibold">{title}</h3>
          </div>
          <div className={`${textColor} whitespace-pre-wrap`}>
            {content}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bot className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">
              Ajudante do Gestor - Insights de IA
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-4">
            Clique no botão abaixo para gerar insights inteligentes baseados nos dados carregados.
            A IA analisará sua performance e fornecerá recomendações acionáveis.
          </p>
          
          {!insights && !error && (
            <button
              onClick={handleGenerateInsights}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                  Gerando insights...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4 mr-2" />
                  Gerar Insights
                </>
              )}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao gerar insights
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {insights && (
          <div className="max-h-96 overflow-y-auto">
            <div className="prose prose-sm max-w-none">
              {formatInsights(insights)}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleGenerateInsights}
                disabled={isLoading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Bot className="h-4 w-4 mr-2" />
                Gerar Novos Insights
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
