import React from 'react';

interface KpiCardProps {
  title: string;
  value: number;
  icon: string;
  subtitle?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, subtitle }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-lg font-medium text-gray-900">
                {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
              </dd>
              {subtitle && (
                <dd className="text-sm text-gray-600">{subtitle}</dd>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;
