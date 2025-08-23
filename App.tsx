import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { AgentData, AnalysisMode } from './types';
import { processFiles } from './services/csvProcessor';
import { useDataAnalysis } from './hooks/useDataAnalysis';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import { LogoIcon, UserIcon, UsersIcon, SunIcon, MoonIcon, SparklesIcon, InfoIcon } from './components/icons';
import InitialScreen from './components/InitialScreen';
import FileManager from './components/FileManager';
import AIAssistant from './components/AIAssistant';
import InfoModal from './components/InfoModal';

const App: React.FC = () => {
  const [fileList, setFileList] = useState<File[]>([]);
  const [agentData, setAgentData] = useState<AgentData[]>([]);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(AnalysisMode.Team);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);
  
  useEffect(() => {
    const processFileList = async () => {
      if (fileList.length === 0) {
        setAgentData([]);
        setError(null);
        return;
      }
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await processFiles(fileList as any);
        setAgentData(data);
        
        if (data.length === 1) {
            if(analysisMode !== AnalysisMode.Individual) setAnalysisMode(AnalysisMode.Individual);
            if(selectedAgent !== data[0].name) setSelectedAgent(data[0].name);
        } else if (data.length > 1) {
            if(analysisMode !== AnalysisMode.Team) setAnalysisMode(AnalysisMode.Team);
            if(selectedAgent !== null && !data.some(d => d.name === selectedAgent)) {
                setSelectedAgent(null);
            }
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Ocorreu um erro desconhecido durante o processamento do arquivo.');
        setAgentData([]);
      } finally {
        setIsLoading(false);
      }
    };

    processFileList();
  }, [fileList]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const analysisResults = useDataAnalysis(agentData);

  const handleAddFiles = useCallback((files: FileList) => {
    const newFiles = Array.from(files);
    setFileList(prevList => {
      const existingNames = new Set(prevList.map(f => f.name));
      const uniqueNewFiles = newFiles.filter(f => !existingNames.has(f.name));
      return [...prevList, ...uniqueNewFiles];
    });
  }, []);

  const handleRemoveFile = useCallback((fileNameToRemove: string) => {
    setFileList(prevList => prevList.filter(file => file.name !== fileNameToRemove));
  }, []);



  const agentNames = useMemo(() => analysisResults.agentNames, [analysisResults]);

  const handleModeChange = (mode: AnalysisMode) => {
    setAnalysisMode(mode);
    if (mode === AnalysisMode.Individual && agentNames.length > 0 && !agentNames.includes(selectedAgent || '')) {
      setSelectedAgent(agentNames[0]);
    } else if (mode === AnalysisMode.Team) {
        setSelectedAgent(null);
    }
  };

  if (fileList.length === 0) {
    return (
        <>
            <InitialScreen 
                onFilesSelected={handleAddFiles} 
                isLoading={isLoading} 
                error={error} 
                onShowInfo={() => setIsInfoModalOpen(true)}
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
        </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-transparent text-foreground dark:text-dark-foreground font-sans">
      <aside className="w-full lg:w-80 border-r border-border dark:border-dark-border p-6 flex-shrink-0 bg-white/70 dark:bg-dark-background/50 backdrop-blur-lg flex flex-col">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
                 <LogoIcon className="h-10 w-10 text-primary dark:text-dark-primary" />
                 <h1 className="text-2xl font-bold text-foreground dark:text-dark-foreground">i2Sales</h1>
                 <button onClick={() => setIsInfoModalOpen(true)} className="p-2 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-muted dark:hover:bg-dark-muted transition-colors" aria-label="Saiba mais">
                    <InfoIcon className="h-6 w-6" />
                 </button>
            </div>
            <button onClick={toggleTheme} className="p-2 rounded-full text-muted-foreground dark:text-dark-muted-foreground hover:bg-muted dark:hover:bg-dark-muted transition-colors">
                {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
            </button>
        </div>
        
        <div className="space-y-6 mb-6">
            <FileUpload onFilesSelected={handleAddFiles} isLoading={isLoading} />
            <FileManager files={fileList} onRemoveFile={handleRemoveFile} />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        
        {agentData.length > 0 && !isLoading && (
          <div className="mt-auto flex flex-col">
            <nav className="space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider mb-2">Modo de Análise</h2>
                <div className="flex rounded-md">
                  <button
                    onClick={() => handleModeChange(AnalysisMode.Individual)}
                    disabled={agentNames.length === 0}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-l-md transition-all duration-200 flex items-center justify-center gap-2 border ${
                      analysisMode === AnalysisMode.Individual 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-transparent text-foreground dark:text-dark-foreground border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <UserIcon className="h-4 w-4" />
                    Individual
                  </button>
                  <button
                    onClick={() => handleModeChange(AnalysisMode.Team)}
                    disabled={agentNames.length < 2}
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-r-md transition-all duration-200 flex items-center justify-center gap-2 border border-l-0 ${
                      analysisMode === AnalysisMode.Team 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'bg-transparent text-foreground dark:text-dark-foreground border-border dark:border-dark-border hover:bg-muted dark:hover:bg-dark-muted'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <UsersIcon className="h-4 w-4" />
                    Equipe
                  </button>
                </div>
              </div>

              {analysisMode === AnalysisMode.Individual && (
                <div>
                  <label htmlFor="agent-select" className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider mb-2 block">Selecione o Agente</label>
                  <select
                    id="agent-select"
                    value={selectedAgent ?? ''}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                    className="w-full p-2 border border-border dark:border-dark-border rounded-md shadow-sm focus:ring-primary focus:border-primary bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground"
                  >
                    {agentNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>
              )}
            </nav>

             <div className="mt-6 pt-6 border-t border-border dark:border-dark-border">
                 <h2 className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider mb-2">Ferramentas IA</h2>
                 <button
                    onClick={() => setIsAssistantOpen(true)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                 >
                    <SparklesIcon className="h-5 w-5" />
                    Ajudante do Gestor
                 </button>
            </div>
          </div>
        )}
      </aside>
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Dashboard
          analysisMode={analysisMode}
          analysisResults={analysisResults}
          selectedAgent={selectedAgent}
          isLoading={isLoading}
          hasData={agentData.length > 0}
        />
      </main>

      <AIAssistant 
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        analysisResults={analysisResults}
        analysisMode={analysisMode}
        selectedAgent={selectedAgent}
      />
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default App;