import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TemporalMetric } from '../types';

interface TemporalChartProps {
  data: TemporalMetric[];
  metrics: string[];
}

const COLORS = ['hsl(25 95% 53%)', 'hsl(0 0% 45.1%)', 'hsl(0 0% 75%)'];
const DARK_COLORS = ['hsl(25 95% 53%)', 'hsl(0 0% 63.9%)', 'hsl(0 0% 30%)'];

const TemporalChart: React.FC<TemporalChartProps> = ({ data, metrics }) => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const chartColors = isDarkMode ? DARK_COLORS : COLORS;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? 'hsl(0 0% 18%)': 'hsl(0 0% 92%)'} />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'currentColor' }} stroke={isDarkMode ? 'hsl(0 0% 63.9%)' : 'hsl(0 0% 45.1%)'} />
        <YAxis tick={{ fontSize: 12, fill: 'currentColor' }} stroke={isDarkMode ? 'hsl(0 0% 63.9%)' : 'hsl(0 0% 45.1%)'} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDarkMode ? 'hsl(0 0% 12%)' : 'hsl(0 0% 100%)',
            borderColor: isDarkMode ? 'hsl(0 0% 18%)' : 'hsl(0 0% 92%)',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.05)',
          }}
          cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
        />
        <Legend wrapperStyle={{fontSize: "14px", color: 'currentColor'}} />
        {metrics.map((metric, index) => (
          <Line
            key={metric}
            type="monotone"
            dataKey={metric}
            stroke={chartColors[index % chartColors.length]}
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TemporalChart;