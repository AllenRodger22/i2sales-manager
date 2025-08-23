import React from 'react';
import { FunnelStage } from '../types';
import { ArrowDownIcon } from './icons';

interface FunnelChartProps {
  data: FunnelStage[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
    const colors = ['bg-red-600', 'bg-orange-500', 'bg-yellow-400', 'bg-lime-500', 'bg-green-600'];

    return (
        <div className="flex flex-col items-center w-full">
            {data.map((stage, index) => {
                const widthPercentage = 100 - index * 10;
                return (
                    <React.Fragment key={stage.name}>
                        {index > 0 && typeof stage.conversionRate === 'number' && (
                            <div 
                                className="flex items-center justify-center w-full my-1.5 text-xs text-muted-foreground dark:text-dark-muted-foreground"
                                style={{ maxWidth: `${100 - (index - 1) * 10}%` }}
                            >
                                <ArrowDownIcon className="h-4 w-4" />
                                <span className="font-semibold ml-1">{stage.conversionRate.toFixed(1)}%</span>
                            </div>
                        )}
                        <div
                            className={`
                                ${colors[index % colors.length]} 
                                text-white text-center p-3 w-full
                                rounded-md
                                transition-all duration-300 ease-in-out
                            `}
                            style={{ width: `${widthPercentage}%` }}
                        >
                            <div className="flex justify-between items-center text-sm">
                                <span className="font-semibold">{stage.name}</span>
                                <span className="font-bold text-base">{stage.value.toLocaleString()}</span>
                            </div>
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
};


export default FunnelChart;