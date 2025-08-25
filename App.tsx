import React, { useState, useMemo, useEffect } from 'react';
import { ApiClient, ClientEvent } from './types';
import Dashboard from './components/Dashboard';
import { LogoIcon, UserIcon, SunIcon, MoonIcon, InfoIcon } from './components/icons';
import InitialScreen from './components/InitialScreen';
import InfoModal from './components/InfoModal';
import { useDataAnalysis } from './hooks/useDataAnalysis';
import { processFiles } from './services/csvProcessor';

const App: React.FC = () => {
  const [allClients, setAllClients] = useState<ApiClient[]>([]);
  const [availableAgents, setAvailableAgents] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  
  const today = new Date().toISOString().split('T')[0];
  const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: thirtyDaysAgo, end: today });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleFilesSelected = async (files: FileList) => {
    if (files.length === 0) return;
    setIsLoading(true);
    setError(null);
    try {
        const clients = await processFiles(files);
        setAllClients(clients);

        if (clients.length > 0) {
          const agentNames = [...new Set(clients.map(client => client.corretor).filter(Boolean))];
          const sortedAgents = agentNames.sort();
          
          setAvailableAgents(sortedAgents);
          
          if (sortedAgents.length > 0) {
            setSelectedAgent(sortedAgents[0]);
          }
        } else {
           setAvailableAgents([]);
           setError('Nenhum dado de cliente válido foi encontrado. Verifique o conteúdo dos seus arquivos CSV.');
        }

    } catch (e) {
        setError(e instanceof Error ? e.message : 'Ocorreu um erro desconhecido ao processar os arquivos.');
        setAvailableAgents([]);
        setAllClients([]);
    } finally {
        setIsLoading(false);
    }
  };


  const clientEvents = useMemo<ClientEvent[]>(() => {
    if (!selectedAgent || allClients.length === 0) {
      return [];
    }
    const agentClients = allClients.filter(c => c.corretor === selectedAgent);
    const events: ClientEvent[] = [];

    agentClients.forEach(client => {
      if (client.historico) {
          client.historico.forEach(item => {
          let event: ClientEvent | null = null;
          switch (item.tipo) {
            case 'STATUS_CHANGE':
              if (item.para) {
                event = {
                  clientId: client.nome,
                  timestamp: item.timestamp,
                  type: 'STATUS_CHANGE',
                  details: { from: item.de, to: item.para },
                };
                 if (item.para === 'Venda Gerada' && client.valorVenda) {
                    event.details.saleValue = client.valorVenda;
                }
              }
              break;
            case 'CALL':
              if (item.resultado) {
                event = {
                  clientId: client.nome,
                  timestamp: item.timestamp,
                  type: 'CALL',
                  details: { result: item.resultado },
                };
              }
              break;
            case 'NOTE':
              event = {
                clientId: client.nome,
                timestamp: item.timestamp,
                type: 'NOTE',
                details: {
                  noteType: item.texto?.toLowerCase().includes('cne') ? 'CNE' : 'Observação',
                },
              };
              break;
          }
          if (event) events.push(event);
        });
      }
    });
    return events;
  }, [selectedAgent, allClients]);

  const analysisData = useDataAnalysis(clientEvents, dateRange);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  const hasData = useMemo(() => !!analysisData?.individualMetrics && analysisData.individualMetrics.kpis.length > 0, [analysisData]);

  if (allClients.length === 0) {
    return (
        <>
            <InitialScreen 
                onFilesSelected={handleFilesSelected}
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
        
        {error && <p className="text-red-500 text-sm my-4 p-3 bg-red-500/10 rounded-md">{error}</p>}
        
        <div className="flex flex-col">
            <nav className="space-y-6">
              <div>
                <h2 className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider mb-2">Modo de Análise</h2>
                <div className="flex rounded-md">
                   <button
                    disabled
                    className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center gap-2 border bg-primary text-primary-foreground border-primary disabled:opacity-75`}
                  >
                    <UserIcon className="h-4 w-4" />
                    Individual
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="agent-select" className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider mb-2 block">Selecione o Corretor</label>
                <select
                  id="agent-select"
                  value={selectedAgent ?? ''}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                  className="w-full p-2 border border-border dark:border-dark-border rounded-md shadow-sm focus:ring-primary focus:border-primary bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground"
                >
                  {availableAgents.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground dark:text-dark-muted-foreground uppercase tracking-wider mb-2 block">Período de Análise</label>
                <div className="flex flex-col space-y-2">
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full p-2 border border-border dark:border-dark-border rounded-md shadow-sm focus:ring-primary focus:border-primary bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground"
                  />
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full p-2 border border-border dark:border-dark-border rounded-md shadow-sm focus:ring-primary focus:border-primary bg-card dark:bg-dark-card text-foreground dark:text-dark-foreground"
                  />
                </div>
              </div>
            </nav>
          </div>
      </aside>
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <Dashboard
          analysisResults={analysisData}
          selectedAgent={selectedAgent}
          isLoading={false}
          hasData={hasData}
        />
      </main>
      
      <InfoModal isOpen={isInfoModalOpen} onClose={() => setIsInfoModalOpen(false)} />
    </div>
  );
};

export default App;