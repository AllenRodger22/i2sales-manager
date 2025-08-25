import { useMemo } from 'react';
import { AnalysisResults, ClientEvent, FunnelStage, IndividualAgentMetrics, Kpi, TemporalMetric } from '../types';

const addConversionRatesToFunnel = (funnelData: Omit<FunnelStage, 'conversionRate'>[]): FunnelStage[] => {
    return funnelData.map((stage, index) => {
        if (index === 0) {
            return { ...stage, conversionRate: 100 };
        }
        const previousStage = funnelData[index - 1];
        const conversionRate = previousStage.value > 0 ? (stage.value / previousStage.value) * 100 : 0;
        return {
            ...stage,
            conversionRate,
        };
    });
};

const emptyMetrics: IndividualAgentMetrics = {
    kpis: [],
    funnel: [],
    temporalData: []
};

interface DateRange {
    start: string; // YYYY-MM-DD
    end: string;   // YYYY-MM-DD
}

export const useDataAnalysis = (events: ClientEvent[], dateRange: DateRange | null): AnalysisResults => {
  return useMemo(() => {
    if (events.length === 0) {
      return { individualMetrics: null, filteredEvents: [] };
    }

    const filteredEvents = dateRange
        ? events.filter(event => {
            const eventDate = event.timestamp.substring(0, 10);
            return eventDate >= dateRange.start && eventDate <= dateRange.end;
        })
        : events;
    
    if (filteredEvents.length === 0) {
        return { 
            individualMetrics: {
                kpis: [
                    { label: 'Total de VGV', value: 'R$ 0,00' },
                    { label: 'Vendas', value: '0' },
                    { label: 'Ligações', value: '0' },
                    { label: 'Documentação', value: '0' },
                ],
                funnel: [],
                temporalData: []
            }, 
            filteredEvents: [] 
        };
    }
    
    const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    const dailyMetrics: Map<string, { [key: string]: number }> = new Map();
    const clientFirsts: Map<string, { [key: string]: string }> = new Map(); 
    const clientState: Map<string, { [key: string]: any }> = new Map();

    const getDaily = (date: string) => {
        if (!dailyMetrics.has(date)) {
            dailyMetrics.set(date, {
                'Ligações': 0,
                'Contatos Efetivos': 0,
                'CNE': 0,
                'Tratativas': 0,
                'Documentação': 0,
                'Vendas': 0,
                'VGV': 0,
            });
        }
        return dailyMetrics.get(date)!;
    };

    const getClientFirsts = (clientId: string) => {
        if (!clientFirsts.has(clientId)) {
            clientFirsts.set(clientId, {});
        }
        return clientFirsts.get(clientId)!;
    };
    
    const getClientState = (clientId: string) => {
        if (!clientState.has(clientId)) {
            clientState.set(clientId, {});
        }
        return clientState.get(clientId)!;
    };

    sortedEvents.forEach(event => {
        const date = event.timestamp.substring(0, 10);
        const daily = getDaily(date);
        const client = getClientFirsts(event.clientId);
        const state = getClientState(event.clientId);

        if (event.type === 'CALL' && !client.firstCallDate) {
            client.firstCallDate = date;
            daily['Ligações'] += 1;
        }

        const isEffectiveContact = (event.type === 'CALL' && event.details.result === 'CE') || (event.type === 'NOTE' && event.details.noteType === 'Observação');
        if (isEffectiveContact && !client.firstCEDate) {
            client.firstCEDate = date;
            daily['Contatos Efetivos'] += 1;
        }
        
        if (event.type === 'STATUS_CHANGE') {
            const { to, from } = event.details;
            if ((to === 'Fluxo de Cadência' || to === 'Tratativa') && !client.firstTratativaDate) {
                client.firstTratativaDate = date;
                daily['Tratativas'] += 1;
            }
        
            if (to === 'Doc Completa' && !client.firstDocDate) {
                 client.firstDocDate = date;
                 daily['Documentação'] += 1;
            }
            
            if (to === 'Venda Gerada') {
                daily['Vendas'] += 1;
                daily['VGV'] += event.details.saleValue || 0;
                state.lastSaleValue = event.details.saleValue || 0;
            } else if (from === 'Venda Gerada') {
                daily['Vendas'] -= 1;
                daily['VGV'] -= state.lastSaleValue || 0;
                state.lastSaleValue = 0;
            }
        }
    });
    
    const totalMetrics = {
        'Ligações': 0, 'Contatos Efetivos': 0, 'Tratativas': 0,
        'Documentação': 0, 'Vendas': 0, 'VGV': 0
    };
    
    const temporalData: TemporalMetric[] = [];
    const sortedDates = Array.from(dailyMetrics.keys()).sort();

    let cumulativeSales = 0;
    let cumulativeVGV = 0;

    sortedDates.forEach(date => {
        const daily = dailyMetrics.get(date)!;
        Object.keys(totalMetrics).forEach(key => {
            if(key !== 'Vendas' && key !== 'VGV') {
                totalMetrics[key as keyof typeof totalMetrics] += daily[key] || 0;
            }
        });

        cumulativeSales += daily['Vendas'] || 0;
        cumulativeVGV += daily['VGV'] || 0;
        
        const formattedDate = date.split('-').reverse().join('/');
        temporalData.push({
            date: formattedDate,
            'Ligações': daily['Ligações'] || 0,
            'Contatos Efetivos': daily['Contatos Efetivos'] || 0,
            'Vendas': daily['Vendas'] || 0,
        });
    });
    totalMetrics['Vendas'] = cumulativeSales;
    totalMetrics['VGV'] = cumulativeVGV;


    const kpis: Kpi[] = [
        { label: 'Total de VGV', value: `R$ ${totalMetrics['VGV'].toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
        { label: 'Vendas', value: totalMetrics['Vendas'].toString() },
        { label: 'Ligações', value: totalMetrics['Ligações'].toString() },
        { label: 'Documentação', value: totalMetrics['Documentação'].toString() },
    ];
    
    const funnel: FunnelStage[] = addConversionRatesToFunnel([
        { name: 'Ligações', value: totalMetrics['Ligações'] },
        { name: 'Contatos Efetivos', value: totalMetrics['Contatos Efetivos'] },
        { name: 'Tratativas', value: totalMetrics['Tratativas'] },
        { name: 'Documentação', value: totalMetrics['Documentação'] },
        { name: 'Venda', value: totalMetrics['Vendas'] > 0 ? totalMetrics['Vendas'] : 0 },
    ]);

    const individualMetrics: IndividualAgentMetrics = {
        kpis,
        funnel,
        temporalData
    };

    return { individualMetrics, filteredEvents: sortedEvents };
  }, [events, dateRange]);
};