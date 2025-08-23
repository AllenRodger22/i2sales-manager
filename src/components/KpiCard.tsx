import React from 'react';

interface KpiCardProps {
  title: string;
  value: number;
  icon: string;
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, subtitle }) => {
  return (
    <div className="bg-white/10 backdrop-blur-md overflow-hidden shadow-xl rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">{icon}</span>
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-white/70 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-bold text-white">
                {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
              </dd>
              {subtitle && (
                <dd className="text-sm text-white/60">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
