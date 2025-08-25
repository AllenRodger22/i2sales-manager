import { ApiClient, ApiHistoryItem } from '../types';

const parseCSV = (content: string): Record<string, string>[] => {
    const cleanContent = content.startsWith('\uFEFF') ? content.substring(1) : content;
    const lines = cleanContent.split('\n').filter(line => line.trim() !== '');
    if (lines.length < 2) return [];

    const header = lines[0].split(',').map(h => h.trim());
    const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

    return lines.slice(1).map(line => {
        const values = line.split(regex);
        const entry: Record<string, string> = {};
        header.forEach((h, i) => {
            let value = (values[i] || '').trim();
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/""/g, '"');
            }
            entry[h] = value;
        });
        return entry;
    });
};

const mapTimelineToHistory = (timeline: any[]): ApiHistoryItem[] => {
    if (!timeline) return [];
    return timeline.map((item: any): ApiHistoryItem | null => {
        const timestamp = item.date;
        if (!timestamp) return null;

        switch (item.type) {
            case 'Mudança de Status':
                return {
                    tipo: 'STATUS_CHANGE',
                    timestamp,
                    de: item.meta?.from,
                    para: item.meta?.to,
                };
            case 'Ligação': {
                let resultado: 'CE' | 'CNE' | undefined;
                if (item.content?.includes('CE -')) resultado = 'CE';
                else if (item.content?.includes('CNE -')) resultado = 'CNE';
                
                return {
                    tipo: 'CALL',
                    timestamp,
                    resultado,
                    texto: item.content,
                };
            }
            case 'Anotação':
            case 'Observação':
            case 'WhatsApp':
            case 'Follow-up Agendado':
                return {
                    tipo: 'NOTE',
                    timestamp,
                    texto: item.content,
                };
            default:
                return null;
        }
    }).filter((item): item is ApiHistoryItem => item !== null);
};


export const processFiles = async (files: FileList): Promise<ApiClient[]> => {
    const allClients: ApiClient[] = [];

    const fileContents = await Promise.all(Array.from(files).map(file => {
        return new Promise<{ name: string; content: string }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ name: file.name, content: e.target?.result as string });
            reader.onerror = () => reject(new Error(`Erro ao ler o arquivo ${file.name}`));
            reader.readAsText(file, 'UTF-8');
        });
    }));
    
    for (const { name, content } of fileContents) {
        // Convention: agent name is the filename without extension.
        const agentName = name.replace(/\.csv$/, '').replace(/_/g, ' ');
        
        try {
            const rows = parseCSV(content);
            for (const row of rows) {
                const anexosJson = row['Anexos (JSON)'];
                let historico: ApiHistoryItem[] = [];

                if (anexosJson) {
                    try {
                        const anexos = JSON.parse(anexosJson);
                        if (anexos.timeline) {
                            historico = mapTimelineToHistory(anexos.timeline);
                        }
                    } catch (e) {
                        console.warn(`Não foi possível analisar o JSON para o cliente ${row['Nome']} no arquivo ${name}`);
                    }
                }
                
                if (row['ID Cliente'] && row['Nome']) {
                     const saleValueRaw = row['Valor de Venda'];
                     const saleValue = saleValueRaw ? parseFloat(saleValueRaw.replace(',', '.')) : undefined;

                    allClients.push({
                        _id: row['ID Cliente'],
                        nome: row['Nome'],
                        corretor: agentName,
                        historico,
                        valorVenda: saleValue,
                    });
                }
            }
        } catch (e) {
            console.error(`Erro ao processar o arquivo ${name}:`, e);
            throw new Error(`Falha ao processar o arquivo ${name}. Verifique o formato do CSV.`);
        }
    }
    
    return allClients;
};