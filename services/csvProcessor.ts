
import { AgentData, ClientData, ProductivityData, ProductivitySet } from '../types';

const parseCSV = <T,>(content: string): T[] => {
  // Remove BOM character if present
  const cleanContent = content.startsWith('\uFEFF') ? content.substring(1) : content;
  const lines = cleanContent.split('\n').filter(line => line.trim() !== '');
  if (lines.length < 2) return [];

  const header = lines[0].split(',').map(h => h.trim());
  
  // Regex to split a CSV row by commas, but ignore commas inside double quotes.
  const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;

  return lines.slice(1).map(line => {
    const values = line.split(regex);
    const entry: any = {};
    header.forEach((h, i) => {
      let value = values[i] ? values[i].trim() : '';
      
      // Remove quotes from start and end if they exist and unescape double quotes ("")
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replace(/""/g, '"');
      }
      
      // A more robust check to see if the value is purely numeric before converting.
      // This prevents date strings like "10/05/2024" from being partially parsed by parseFloat.
      if (value !== '' && !isNaN(Number(value)) && !value.includes('/')) {
        entry[h] = Number(value);
      } else {
        entry[h] = value;
      }
    });
    return entry as T;
  });
};

const formatDate = (dateStr: string): string => { // ddmmyyyy -> dd/mm/yyyy
    return `${dateStr.substring(0, 2)}/${dateStr.substring(2, 4)}/${dateStr.substring(4, 8)}`;
};

const createSortKey = (dateStr: string): string => { // ddmmyyyy -> yyyymmdd
    return `${dateStr.substring(4, 8)}${dateStr.substring(2, 4)}${dateStr.substring(0, 2)}`;
}

const extractFileInfo = (filename: string): { agentName: string | null; period: { display: string, sortKey: string } | null } => {
    const cleanFilename = filename.replace(/\.csv$/, '');
    const baseMatch = cleanFilename.match(/^(produtividade|clientes)_([^_]+)_(.+)$/i);

    if (!baseMatch) {
        return { agentName: null, period: null };
    }
    
    const agentName = baseMatch[2];
    const periodPart = baseMatch[3];

    const dateMatch = periodPart.match(/^(\d{8})-(\d{8})$/);

    if (dateMatch) {
        const startDate = dateMatch[1];
        const endDate = dateMatch[2];
        return {
            agentName,
            period: {
                display: `${formatDate(startDate)} - ${formatDate(endDate)}`,
                sortKey: createSortKey(startDate)
            }
        };
    }

    // Fallback for any other period format
    return {
        agentName,
        period: {
            display: periodPart,
            sortKey: periodPart
        }
    };
};

export const processFiles = async (files: FileList): Promise<AgentData[]> => {
  const fileContents = await Promise.all(Array.from(files).map(file => {
    return new Promise<{ name: string; content: string }>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ name: file.name, content: e.target?.result as string });
      reader.onerror = (e) => reject(new Error(`Erro ao ler o arquivo ${file.name}`));
      reader.readAsText(file);
    });
  }));

  const agentFiles: Record<string, {
    productivityFiles: { period: { display: string; sortKey: string }; content: string }[];
    clientFile?: { period: { display: string; sortKey: string }; content: string };
  }> = {};

  for (const { name, content } of fileContents) {
    const { agentName, period } = extractFileInfo(name);
    if (!agentName || !period) {
      console.warn(`Não foi possível extrair o nome do agente e o período do arquivo: ${name}. Ignorando.`);
      continue;
    }

    if (!agentFiles[agentName]) {
      agentFiles[agentName] = { productivityFiles: [] };
    }

    if (name.toLowerCase().startsWith('produtividade_')) {
      agentFiles[agentName].productivityFiles.push({ period, content });
    } else if (name.toLowerCase().startsWith('clientes_')) {
      if (agentFiles[agentName].clientFile) {
        throw new Error(`Múltiplos arquivos de clientes encontrados para o agente ${agentName}. Forneça apenas um.`);
      }
      agentFiles[agentName].clientFile = { period, content };
    }
  }

  const agentData: AgentData[] = [];
  for (const agentName in agentFiles) {
    const filesForAgent = agentFiles[agentName];
    if (filesForAgent.productivityFiles.length > 0 && filesForAgent.clientFile) {
      agentData.push({
        name: agentName,
        productivitySets: filesForAgent.productivityFiles.map(pf => ({
          period: pf.period,
          data: parseCSV<ProductivityData>(pf.content),
        })),
        clients: parseCSV<ClientData>(filesForAgent.clientFile.content),
      });
    } else {
        throw new Error(`Faltando um arquivo para o agente ${agentName}. Cada agente requer pelo menos um arquivo de produtividade e exatamente um de clientes.`);
    }
  }

  if(agentData.length === 0 && fileContents.length > 0) {
    throw new Error('Nenhum conjunto de arquivos válido encontrado. Verifique se os nomes dos arquivos estão corretos (ex: "produtividade_joao_01082024-31082024.csv").');
  }

  return agentData;
};