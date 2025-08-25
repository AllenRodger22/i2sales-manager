import React from 'react';
import { ClientEvent } from '../types';
import { PhoneIcon, PencilIcon, ArrowPathIcon } from './icons';

const eventConfig = {
    CALL: { icon: <PhoneIcon className="h-5 w-5 text-blue-500" />, label: 'Ligação', color: 'text-blue-500' },
    NOTE: { icon: <PencilIcon className="h-5 w-5 text-yellow-500" />, label: 'Anotação', color: 'text-yellow-500' },
    STATUS_CHANGE: { icon: <ArrowPathIcon className="h-5 w-5 text-purple-500" />, label: 'Mudança de Status', color: 'text-purple-500' },
};

const getEventDescription = (event: ClientEvent): string => {
    switch (event.type) {
        case 'CALL':
            return `Resultado: ${event.details.result}`;
        case 'NOTE':
            return `Tipo: ${event.details.noteType}`;
        case 'STATUS_CHANGE':
            if (event.details.from) {
                return `${event.details.from} → ${event.details.to}`;
            }
            return `Novo status: ${event.details.to}`;
        default:
            return 'Evento desconhecido';
    }
}

interface RecentActivityProps {
  events: ClientEvent[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ events }) => {
  const recentEvents = [...events]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 15);

  return (
    <section>
        <h3 className="text-2xl font-semibold text-foreground dark:text-dark-foreground mb-4">Atividades Recentes</h3>
        <div className="p-4 bg-card/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-lg shadow h-[450px] overflow-y-auto border border-border dark:border-dark-border">
            {recentEvents.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground dark:text-dark-muted-foreground">
                    <p>Nenhuma atividade no período selecionado.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {recentEvents.map((event, index) => {
                        const config = eventConfig[event.type];
                        const description = getEventDescription(event);
                        const eventDate = new Date(event.timestamp);

                        return (
                            <li key={`${event.timestamp}-${index}`} className="flex items-start gap-4 p-2 rounded-md hover:bg-muted/80 dark:hover:bg-dark-muted/80">
                                <div className="mt-1 flex-shrink-0">{config.icon}</div>
                                <div className="flex-grow">
                                    <p className={`font-semibold text-sm ${config.color}`}>{config.label}</p>
                                    <p className="text-xs text-foreground dark:text-dark-foreground mt-0.5">
                                        <span className="font-medium">Cliente:</span> {event.clientId}
                                    </p>
                                    <p className="text-xs text-muted-foreground dark:text-dark-muted-foreground">{description}</p>
                                </div>
                                <div className="text-right text-xs text-muted-foreground dark:text-dark-muted-foreground flex-shrink-0">
                                    <p>{eventDate.toLocaleDateString('pt-BR')}</p>
                                    <p>{eventDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    </section>
  );
};

export default RecentActivity;
