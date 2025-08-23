import React, { useState, useEffect } from 'react';
import { AnalysisMode, AnalysisResults } from '../types';
import { getInsights } from '../services/geminiService';
import { CloseIcon, SparklesIcon, ClipboardListIcon, CheckCircleIcon, AlertTriangleIcon, LightBulbIcon } from './icons';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResults: AnalysisResults;
  analysisMode: AnalysisMode;
  selectedAgent: string | null;
}

const sectionConfig = {
    'Resumo': {
        icon: <ClipboardListIcon className="h-6 w-6 text-primary" />,
        color: 'text-primary'
    },
    'Destaques Positivos': {
        icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
        color: 'text-green-500'
    },
    'Pontos de Atenção': {
        icon: <AlertTriangleIcon className="h-6 w-6 text-amber-500" />,
        color: 'text-amber-500'
    },
    'Ações Sugeridas': {
        icon: <LightBulbIcon className="h-6 w-6 text-blue-500" />,
        color: 'text-blue-500'
    }
};

const parseInsights = (text: string) => {
    const sections = text.split('### ').filter(Boolean);
    
    return sections.map(sectionText => {
        const [title, ...contentParts] = sectionText.split('\n');
        const content = contentParts.join('\n').trim();

        const trimmedTitle = title.trim();
        const config = sectionConfig[trimmedTitle as keyof typeof sectionConfig];

        const parsedContent = content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/^- (.*$)/gm, '<li class="flex items-start"><span class="mr-3 mt-2 h-1.5 w-1.5 rounded-full bg-current flex-shrink-0"></span><span>$1</span></li>')
            .replace(/(<li.*<\/li>)/gms, `<ul class="space-y-2 ${config?.color || ''}">$1</ul>`)
            .replace(/<\/ul>\s*<ul class=".*">/gms, '')
            .replace(/\n/g, '<br />');

        return {
            title: trimmedTitle,
            content: parsedContent,
            config: config
        };
    }).filter(s => s.config);
};


const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, analysisResults, analysisMode, selectedAgent }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const fetchInsights = async () => {
        setIsLoading(true);
        setError(null);
        setInsights('');
        try {
          const result = await getInsights(analysisResults, analysisMode, selectedAgent);
          setInsights(result);
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchInsights();
    }
  }, [isOpen, analysisResults, analysisMode, selectedAgent]);

  if (!isOpen) {
    return null;
  }

  const parsedInsights = insights ? parseInsights(insights) : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="bg-card dark:bg-dark-card w-full max-w-2xl max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-border dark:border-dark-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground">Ajudante do Gestor</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-muted dark:hover:bg-dark-muted" aria-label="Fechar">
            <CloseIcon className="h-5 w-5" />
          </button>
        </header>
        <main className="p-6 overflow-y-auto bg-muted/30 dark:bg-dark-muted/30">
          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground dark:text-dark-muted-foreground space-y-3 min-h-[200px]">
              <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Analisando dados e gerando insights...</p>
            </div>
          )}
          {error && (
            <div className="text-center text-red-600 dark:text-red-500 bg-red-500/10 p-4 rounded-md min-h-[200px] flex flex-col justify-center items-center">
              <p className="font-semibold text-lg">Erro ao gerar insights</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}
          {parsedInsights.length > 0 && !isLoading && (
             <div className="space-y-6">
                 {parsedInsights.map(section => (
                     <div key={section.title} className="p-4 rounded-lg bg-card dark:bg-dark-card border border-border dark:border-dark-border shadow">
                         <h3 className={`flex items-center gap-3 font-semibold text-lg mb-3 ${section.config.color}`}>
                             {section.config.icon}
                             {section.title}
                         </h3>
                         <div 
                             className="prose prose-sm dark:prose-invert max-w-none text-foreground/90 dark:text-dark-foreground/90"
                             dangerouslySetInnerHTML={{ __html: section.content }} 
                         />
                     </div>
                 ))}
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AIAssistant;