import { GoogleGenAI } from "@google/genai";
import { AnalysisMode, AnalysisResults, IndividualAgentMetrics, TeamMetrics } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

function prepareTeamPrompt(metrics: TeamMetrics): string {
    const isComparative = metrics.isComparative && metrics.comparison;
    return `
Análise de Equipe:
- Ranking de Vendas: ${JSON.stringify(metrics.salesRanking.slice(0, 5))}
- Ranking de Ligações: ${JSON.stringify(metrics.callsRanking.slice(0, 5))}
- Funil de Vendas Consolidado: ${JSON.stringify(metrics.consolidatedFunnel)}
${isComparative ? `- Comparativo de KPIs (Período Atual vs Anterior): ${JSON.stringify(metrics.comparison?.comparativeKpis)}` : ''}

Com base nestes dados da equipe, forneça um relatório com as seguintes seções:
### Resumo
Um resumo conciso da performance geral da equipe.

### Destaques Positivos
Destaques positivos (ex: quem está performando bem e em quê).

### Pontos de Atenção
Pontos de atenção ou áreas que precisam de melhoria.

### Ações Sugeridas
Duas sugestões de ações práticas que um gestor pode tomar para melhorar os resultados.
`;
}

function prepareIndividualPrompt(agentName: string, metrics: IndividualAgentMetrics): string {
    const isComparative = metrics.isComparative && metrics.comparison;
    return `
Análise Individual do Agente: ${agentName}
- KPIs Principais: ${JSON.stringify(metrics.kpis)}
- Funil de Vendas: ${JSON.stringify(metrics.funnel)}
${isComparative ? `- Comparativo de KPIs (Período ${metrics.comparison?.currentPeriod} vs ${metrics.comparison?.previousPeriod}): ${JSON.stringify(metrics.comparison?.comparativeKpis)}` : ''}

Com base nestes dados do agente, forneça um relatório com as seguintes seções:
### Resumo
Um resumo conciso da performance do agente.

### Destaques Positivos
Os principais pontos fortes (destaques positivos).

### Pontos de Atenção
Pontos de atenção ou áreas onde o agente pode melhorar.

### Ações Sugeridas
Duas sugestões de ações práticas que um gestor pode tomar para apoiar o desenvolvimento deste agente.
`;
}

export const getInsights = async (
    analysisResults: AnalysisResults, 
    mode: AnalysisMode, 
    selectedAgent: string | null
): Promise<string> => {
    let prompt = '';
    if (mode === AnalysisMode.Team) {
        prompt = prepareTeamPrompt(analysisResults.teamMetrics);
    } else if (mode === AnalysisMode.Individual && selectedAgent) {
        const agentMetrics = analysisResults.individualMetrics[selectedAgent];
        if (agentMetrics) {
            prompt = prepareIndividualPrompt(selectedAgent, agentMetrics);
        } else {
            throw new Error('Dados do agente selecionado não encontrados.');
        }
    } else {
        throw new Error('Modo de análise inválido ou agente não selecionado.');
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "Você é um assistente de gerência de vendas, um especialista em análise de dados. Sua tarefa é analisar os dados de performance de vendas fornecidos e gerar insights acionáveis, concisos e claros em português do Brasil. Para a análise do funil de vendas, considere as seguintes taxas de conversão ideais como referência: da etapa 1 para a 2 (Ligações -> Atendimento) é 30%; da 2 para a 3 (Atendimento -> Tratativa) é 20%; da 3 para a 4 (Tratativa -> Documentação) é 20%; e da 4 para a 5 (Documentação -> Venda) é 20%. Compare os resultados atuais com essas metas para identificar desvios e oportunidades. Responda de forma profissional e direta. Formate sua resposta usando markdown com os cabeçalhos exatos fornecidos no prompt (### Resumo, ### Destaques Positivos, etc.). Use '**' para negrito para destacar termos importantes e '-' para listas de itens.",
            }
        });
        
        return response.text;
    } catch (error) {
        console.error('Erro na API Gemini:', error);
        throw new Error('Não foi possível gerar os insights. Tente novamente mais tarde.');
    }
};