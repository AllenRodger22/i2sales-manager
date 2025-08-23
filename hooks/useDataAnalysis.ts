import { useMemo } from 'react';
import { AgentData, AnalysisResults, FunnelStage, IndividualAgentMetrics, Kpi, KpiComparison, ProductivityData, RankingItem, TeamMetrics } from '../types';

const parseFollowUpDate = (dateString: string): Date | null => {
    if (!dateString || typeof dateString !== 'string') return null;
    try {
        const datePart = dateString.split(',')[0].trim();
        const [day, month, year] = datePart.split('/');
        if (!day || !month || !year || year.length !== 4) return null;
        const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const date = new Date(isoDate);
        // Check for invalid date from Date constructor
        if (isNaN(date.getTime())) return null;
        return date;
    } catch (e) {
        console.error("Error parsing date:", dateString, e);
        return null;
    }
};

const addConversionRatesToFunnel = (funnelData: Omit<FunnelStage, 'conversionRate'>[]): FunnelStage[] => {
    return funnelData.map((stage, index) => {
        if (index === 0) {
            return stage; // No conversion rate for the first stage.
        }
        const previousStage = funnelData[index - 1];
        const conversionRate = previousStage.value > 0 ? (stage.value / previousStage.value) * 100 : 0;
        return {
            ...stage,
            conversionRate,
        };
    });
};


const calculateProductivityKpis = (productivityData: ProductivityData[]) => {
  const totalSales = productivityData.reduce((sum, day) => sum + day.Vendas, 0);
  const totalCalls = productivityData.reduce((sum, day) => sum + day.Ligações, 0);
  const totalEffectiveContacts = productivityData.reduce((sum, day) => sum + day['Contatos Efetivos'], 0);
  const averageCallsPerDay = productivityData.length > 0 ? (totalCalls / productivityData.length) : 0;
  const recordCalls = productivityData.length > 0 ? Math.max(...productivityData.map(p => p.Ligações)) : 0;
  return { totalSales, totalCalls, totalEffectiveContacts, averageCallsPerDay, recordCalls };
};

const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? Infinity : 0;
    return ((current - previous) / previous) * 100;
};

const calculateIndividualMetrics = (agent: AgentData): IndividualAgentMetrics => {
  const sortedSets = [...agent.productivitySets].sort((a, b) => b.period.sortKey.localeCompare(a.period.sortKey));
  const currentProductivitySet = sortedSets[0];
  const { productivity, clients } = { productivity: currentProductivitySet.data, clients: agent.clients };

  const { totalSales, totalCalls, averageCallsPerDay, recordCalls, totalEffectiveContacts } = calculateProductivityKpis(productivity);
  
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const followUpsRealizados = clients.filter(c => {
    const followUpDate = parseFollowUpDate(c['Data Follow-up']);
    return followUpDate && followUpDate < now;
  }).length;
  
  const followUpsFuturos = clients.filter(c => {
    const followUpDate = parseFollowUpDate(c['Data Follow-up']);
    return followUpDate && followUpDate >= now;
  }).length;

  const kpis: Kpi[] = [
    { label: 'Total de Vendas', value: totalSales.toString() },
    { label: 'Média de Ligações/Dia', value: averageCallsPerDay.toFixed(1) },
    { label: 'Recorde de Ligações (1 dia)', value: recordCalls.toString() },
    { label: 'Follow-ups Realizados', value: followUpsRealizados.toString() },
    { label: 'Follow-ups Futuros', value: followUpsFuturos.toString() },
  ];
  
  const funnel = addConversionRatesToFunnel([
    { name: 'Ligações', value: totalCalls },
    { name: 'Atendimento', value: totalEffectiveContacts },
    { name: 'Tratativa', value: clients.filter(c => c.Status === 'Tratativa').length },
    { name: 'Documentação', value: clients.filter(c => c.Status === 'Documentação' || c.Status === 'Aguardando Doc' || c.Status === 'Em Análise').length },
    { name: 'Venda', value: totalSales },
  ]);

  const temporalData = productivity.map(p => ({
    date: p.Data,
    'Ligações': p.Ligações,
    'Contatos Efetivos': p['Contatos Efetivos'],
    'Vendas': p.Vendas,
  })).sort((a,b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());

  const baseMetrics: IndividualAgentMetrics = { kpis, funnel, temporalData, isComparative: false };

  if (sortedSets.length > 1) {
    const previousProductivitySet = sortedSets[1];
    const previousMetrics = calculateProductivityKpis(previousProductivitySet.data);

    const comparativeKpis: KpiComparison[] = [
        { 
            label: 'Total de Vendas', 
            currentValue: totalSales.toString(), 
            previousValue: previousMetrics.totalSales.toString(), 
            changePercentage: calculateChange(totalSales, previousMetrics.totalSales) 
        },
        { 
            label: 'Média de Ligações/Dia', 
            currentValue: averageCallsPerDay.toFixed(1), 
            previousValue: previousMetrics.averageCallsPerDay.toFixed(1), 
            changePercentage: calculateChange(averageCallsPerDay, previousMetrics.averageCallsPerDay) 
        },
        { 
            label: 'Recorde de Ligações', 
            currentValue: recordCalls.toString(), 
            previousValue: previousMetrics.recordCalls.toString(), 
            changePercentage: calculateChange(recordCalls, previousMetrics.recordCalls) 
        },
    ];

    return {
        ...baseMetrics,
        isComparative: true,
        comparison: {
            currentPeriod: currentProductivitySet.period.display,
            previousPeriod: previousProductivitySet.period.display,
            comparativeKpis,
        }
    };
  }

  return baseMetrics;
};

const getMostRecentProductivity = (agents: AgentData[]) => {
    return agents.map(agent => ({
        name: agent.name,
        clients: agent.clients,
        productivity: [...agent.productivitySets].sort((a, b) => b.period.sortKey.localeCompare(a.period.sortKey))[0].data
    }));
};

const calculateTeamMetrics = (agents: AgentData[]): TeamMetrics => {
    const emptyMetrics: TeamMetrics = { salesRanking: [], callsRanking: [], docsRanking: [], followUpsRanking: [], consolidatedFunnel: [], teamTemporalData: [], isComparative: false };
    if (agents.length === 0) return emptyMetrics;
    
    // --- Standard Metrics Calculation (using most recent data) ---
    const agentsWithMostRecentData = getMostRecentProductivity(agents);
    const allRecentProductivity = agentsWithMostRecentData.flatMap(a => a.productivity);
    const allClients = agents.flatMap(a => a.clients);

    const rankingsData = agentsWithMostRecentData.map(agent => {
        const { totalSales, totalCalls } = calculateProductivityKpis(agent.productivity);
        const totalDocs = agent.clients.filter(c => ['Documentação', 'Aguardando Doc', 'Em Análise'].includes(c.Status)).length;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        const followUpsRealizados = agent.clients.filter(c => {
            const followUpDate = parseFollowUpDate(c['Data Follow-up']);
            return followUpDate && followUpDate < now;
        }).length;
        return { name: agent.name, sales: totalSales, calls: totalCalls, docs: totalDocs, followUps: followUpsRealizados };
    });
    
    const salesRanking = [...rankingsData].sort((a, b) => b.sales - a.sales).map(a => ({ name: a.name, value: a.sales }));
    const callsRanking = [...rankingsData].sort((a, b) => b.calls - a.calls).map(a => ({ name: a.name, value: a.calls }));
    const docsRanking = [...rankingsData].sort((a, b) => b.docs - a.docs).map(a => ({ name: a.name, value: a.docs }));
    const followUpsRanking = [...rankingsData].sort((a, b) => b.followUps - a.followUps).map(a => ({ name: a.name, value: a.followUps }));

    const { totalCalls: totalCallsAll, totalSales: totalSalesAll, totalEffectiveContacts: totalEffectiveContactsAll } = calculateProductivityKpis(allRecentProductivity);
    const totalTratativa = allClients.filter(c => c.Status === 'Tratativa').length;
    const totalDocumentacao = allClients.filter(c => ['Documentação', 'Documentacao', 'Aguardando Doc', 'Em Análise'].includes(c.Status)).length;

    const consolidatedFunnel = addConversionRatesToFunnel([
        { name: 'Ligações', value: totalCallsAll },
        { name: 'Atendimento', value: totalEffectiveContactsAll },
        { name: 'Tratativa', value: totalTratativa },
        { name: 'Documentação', value: totalDocumentacao },
        { name: 'Venda', value: totalSalesAll },
    ]);

    const dailyData: Record<string, { 'Ligações': number }> = {};
    allRecentProductivity.forEach(day => {
        if (!dailyData[day.Data]) dailyData[day.Data] = { 'Ligações': 0 };
        dailyData[day.Data]['Ligações'] += day.Ligações;
    });

    const teamTemporalData = Object.entries(dailyData)
        .map(([date, values]) => ({ date, ...values }))
        .sort((a, b) => new Date(a.date.split('/').reverse().join('-')).getTime() - new Date(b.date.split('/').reverse().join('-')).getTime());
    
    const baseTeamMetrics: TeamMetrics = { salesRanking, callsRanking, docsRanking, followUpsRanking, consolidatedFunnel, teamTemporalData, isComparative: false };

    // --- Comparative Metrics Calculation ---
    const canDoComparative = agents.length > 0 && agents.every(a => a.productivitySets.length >= 2);

    if (!canDoComparative) {
        return baseTeamMetrics;
    }

    const sortedSetsByAgent = agents.map(a => [...a.productivitySets].sort((x, y) => y.period.sortKey.localeCompare(x.period.sortKey)));
    
    const currentProductivity = sortedSetsByAgent.map(sets => sets[0].data).flat();
    const previousProductivity = sortedSetsByAgent.map(sets => sets[1].data).flat();

    const currentAggrKPIs = calculateProductivityKpis(currentProductivity);
    const previousAggrKPIs = calculateProductivityKpis(previousProductivity);

    const comparativeKpis: KpiComparison[] = [
        { label: 'Total de Vendas', currentValue: currentAggrKPIs.totalSales.toString(), previousValue: previousAggrKPIs.totalSales.toString(), changePercentage: calculateChange(currentAggrKPIs.totalSales, previousAggrKPIs.totalSales) },
        { label: 'Total de Ligações', currentValue: currentAggrKPIs.totalCalls.toString(), previousValue: previousAggrKPIs.totalCalls.toString(), changePercentage: calculateChange(currentAggrKPIs.totalCalls, previousAggrKPIs.totalCalls) },
        { label: 'Contatos Efetivos', currentValue: currentAggrKPIs.totalEffectiveContacts.toString(), previousValue: previousAggrKPIs.totalEffectiveContacts.toString(), changePercentage: calculateChange(currentAggrKPIs.totalEffectiveContacts, previousAggrKPIs.totalEffectiveContacts) },
    ];
    
    // The funnel stages based on client data will be the same for both periods, as we only have one client file.
    const previousConsolidatedFunnel = addConversionRatesToFunnel([
        { name: 'Ligações', value: previousAggrKPIs.totalCalls },
        { name: 'Atendimento', value: previousAggrKPIs.totalEffectiveContacts },
        { name: 'Tratativa', value: totalTratativa },
        { name: 'Documentação', value: totalDocumentacao },
        { name: 'Venda', value: previousAggrKPIs.totalSales },
    ]);

    return {
        ...baseTeamMetrics,
        isComparative: true,
        comparison: {
            currentPeriod: sortedSetsByAgent[0][0].period.display,
            previousPeriod: sortedSetsByAgent[0][1].period.display,
            comparativeKpis,
            previousConsolidatedFunnel,
        }
    };
};


export const useDataAnalysis = (agents: AgentData[]): AnalysisResults => {
  return useMemo(() => {
    const individualMetrics: Record<string, IndividualAgentMetrics> = {};
    agents.forEach(agent => {
      try {
        individualMetrics[agent.name] = calculateIndividualMetrics(agent);
      } catch (error) {
        console.error(`Falha ao processar dados para o agente ${agent.name}:`, error);
      }
    });

    const teamMetrics = calculateTeamMetrics(agents);

    return {
      individualMetrics,
      teamMetrics,
      agentNames: agents.map(a => a.name).sort(),
    };
  }, [agents]);
};