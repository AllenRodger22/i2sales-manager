import React from 'react';
import { CloseIcon, InfoIcon, UserIcon, UsersIcon } from './icons';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const analysisModes = [
  {
    title: 'Análise Individual',
    subtitle: 'Normal',
    Icon: UserIcon,
    purpose: 'Avaliar a performance de <strong>um corretor</strong> em um período específico.',
    filesNeeded: [
      '<strong>1 arquivo</strong> de produtividade',
      '<strong>1 arquivo</strong> de clientes'
    ],
    examples: [
      'produtividade_Joao_01012025-31012025.csv',
      'clientes_Joao_base_completa.csv',
    ]
  },
  {
    title: 'Análise Individual',
    subtitle: 'Comparativa',
    Icon: UserIcon,
    purpose: 'Comparar a evolução de <strong>um corretor</strong> entre dois ou mais períodos.',
    filesNeeded: [
      '<strong>2+ arquivos</strong> de produtividade (períodos diferentes)',
      '<strong>1 arquivo</strong> de clientes'
    ],
    examples: [
      'produtividade_Joao_01012025-31012025.csv',
      'produtividade_Joao_01022025-28022025.csv',
      'clientes_Joao_base_completa.csv',
    ]
  },
  {
    title: 'Análise de Equipe',
    subtitle: 'Normal',
    Icon: UsersIcon,
    purpose: 'Avaliar a performance de <strong>toda a equipe</strong> em um mesmo período.',
    filesNeeded: [
      'Para <strong>cada corretor</strong>:',
      '↳ <strong>1 arquivo</strong> de produtividade',
      '↳ <strong>1 arquivo</strong> de clientes',
    ],
    examples: [
      'produtividade_Joao_01012025-31012025.csv',
      'clientes_Joao_base_completa.csv',
      'produtividade_Maria_01012025-31012025.csv',
      'clientes_Maria_base_completa.csv',
    ]
  },
  {
    title: 'Análise de Equipe',
    subtitle: 'Comparativa',
    Icon: UsersIcon,
    purpose: 'Comparar a evolução da <strong>equipe inteira</strong> entre dois ou mais períodos.',
    filesNeeded: [
      'Para <strong>cada corretor</strong>:',
      '↳ <strong>2+ arquivos</strong> de produtividade (períodos diferentes)',
      '↳ <strong>1 arquivo</strong> de clientes',
    ],
    examples: [
      'produtividade_Joao_01012025-31012025.csv',
      'produtividade_Joao_01022025-28022025.csv',
      'clientes_Joao_base_completa.csv',
      '<em>(...e o mesmo para os outros corretores)</em>'
    ]
  }
];

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="bg-card dark:bg-dark-card w-full max-w-4xl max-h-[90vh] rounded-lg shadow-lg flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-border dark:border-dark-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <InfoIcon className="h-6 w-6 text-primary" />
                        <h2 className="text-lg font-semibold text-foreground dark:text-dark-foreground">Modos de Análise e Arquivos</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-muted-foreground hover:bg-muted dark:hover:bg-dark-muted" aria-label="Fechar">
                        <CloseIcon className="h-5 w-5" />
                    </button>
                </header>
                <main className="p-6 overflow-y-auto text-sm text-foreground/90 dark:text-dark-foreground/90">
                    <div className="p-4 bg-muted/50 dark:bg-dark-muted/50 rounded-lg border border-border dark:border-dark-border mb-6">
                        <h3 className="font-semibold text-foreground dark:text-dark-foreground mb-2">Estrutura de Nomenclatura dos Arquivos</h3>
                        <p className="mb-3">Para que a análise funcione, os arquivos CSV devem seguir um padrão de nomenclatura. O sistema extrai o <strong>nome do agente</strong> e o <strong>período</strong> diretamente do nome do arquivo.</p>
                        <div className="space-y-2 text-sm">
                            <div>
                                <p><strong>Produtividade:</strong> <code className="text-xs bg-card dark:bg-dark-card p-1 rounded-md">produtividade_&lt;NomeAgente&gt;_&lt;DataInicio&gt;-&lt;DataFim&gt;.csv</code></p>
                            </div>
                            <div>
                                <p><strong>Clientes:</strong> <code className="text-xs bg-card dark:bg-dark-card p-1 rounded-md">clientes_&lt;NomeAgente&gt;_&lt;QualquerDescricao&gt;.csv</code></p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {analysisModes.map(({ title, subtitle, Icon, purpose, filesNeeded, examples }) => (
                        <div key={title+subtitle} className="bg-muted/50 dark:bg-dark-muted/50 p-4 rounded-lg border border-border dark:border-dark-border flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon className="h-8 w-8 text-primary/80 flex-shrink-0" />
                            <div>
                              <h3 className="font-semibold text-lg text-foreground dark:text-dark-foreground">{title}</h3>
                              <p className="text-sm text-primary dark:text-dark-primary font-medium">{subtitle}</p>
                            </div>
                          </div>
                          <div className="space-y-3 text-foreground/80 dark:text-dark-foreground/80">
                             <p dangerouslySetInnerHTML={{ __html: purpose }} />
                             <div>
                                <h4 className="font-semibold text-foreground dark:text-dark-foreground mb-1">Arquivos necessários:</h4>
                                <ul className="space-y-1">
                                  {filesNeeded.map((file, i) => <li key={i} className="text-xs" dangerouslySetInnerHTML={{ __html: `• ${file}`}}/>)}
                                </ul>
                             </div>
                             <div>
                                <h4 className="font-semibold text-foreground dark:text-dark-foreground mb-1">Exemplo:</h4>
                                <div className="p-2 bg-card dark:bg-dark-card rounded text-xs space-y-1 font-mono">
                                  {examples.map((ex, i) => <p key={i} dangerouslySetInnerHTML={{ __html: ex }}/>)}
                                </div>
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default InfoModal;
