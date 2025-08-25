import React from 'react';
import { CloseIcon, InfoIcon } from './icons';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const metricDefinitions = [
  {
    title: 'Total de VGV (Valor Geral de Vendas)',
    description: 'Soma total dos valores de todas as vendas geradas no período. É uma métrica cumulativa que aumenta com novas vendas e diminui se uma venda for revertida.'
  },
  {
    title: 'Vendas',
    description: 'Esta é uma métrica cumulativa. <strong>Soma +1</strong> no dia em que um status muda para "Venda Gerada" e <strong>subtrai -1</strong> se um cliente que era "Venda Gerada" tiver seu status alterado para qualquer outro.'
  },
  {
    title: 'Ligações',
    description: 'Conta +1 no dia em que a <strong>primeira ligação</strong> (seja CE ou CNE) é registrada para um cliente. Ligações futuras para o mesmo cliente não são contadas novamente nesta métrica.'
  },
  {
    title: 'Documentação',
    description: 'Conta +1 no dia em que o status de um cliente é alterado pela <strong>primeira vez</strong> para "Doc Completa".'
  }
];


const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-card dark:bg-dark-card w-full max-w-3xl max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-border dark:border-dark-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <InfoIcon className="h-6 w-6 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground">Entendendo as Métricas</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-muted dark:hover:bg-dark-muted" aria-label="Fechar">
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto text-sm text-foreground/90 dark:text-dark-foreground/90">
                    <p className="mb-6">
                        A análise é feita com base no histórico de eventos de cada cliente, extraído dos arquivos CSV. Abaixo está o detalhamento de como cada métrica chave é calculada:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {metricDefinitions.map(({ title, description }) => (
                        <div key={title} className="bg-muted/50 dark:bg-dark-muted/50 p-4 rounded-lg border border-border dark:border-dark-border">
                          <h3 className="font-semibold text-base text-foreground dark:text-dark-foreground mb-2">{title}</h3>
                          <p className="text-foreground/80 dark:text-dark-foreground/80" dangerouslySetInnerHTML={{ __html: description }} />
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-muted/50 dark:bg-dark-muted/50 rounded-lg border border-border dark:border-dark-border">
                        <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-2">Funil de Vendas e Outras Métricas</h3>
                        <p>O funil de vendas e outras métricas de apoio (como Contatos Efetivos e Tratativas) continuam sendo calculados para análises temporais e de conversão, mesmo que não apareçam como KPIs principais.</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InfoModal;