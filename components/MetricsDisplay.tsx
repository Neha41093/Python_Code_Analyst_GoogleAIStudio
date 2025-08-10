
import React from 'react';
import type { Metrics } from '../types';

interface MetricCardProps {
  label: string;
  value: string | number;
  colorClass: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, colorClass }) => (
  <div className={`flex-1 p-4 bg-slate-100 rounded-lg text-center transition-all duration-300 hover:bg-slate-200/60`}>
    <p className="text-sm text-slate-500">{label}</p>
    <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
  </div>
);

interface MetricsDisplayProps {
  metrics: Metrics;
}

export const MetricsDisplay: React.FC<MetricsDisplayProps> = ({ metrics }) => {
  const complexityColor = {
    'Low': 'text-green-500',
    'Medium': 'text-yellow-500',
    'High': 'text-orange-500',
    'Very High': 'text-red-500',
  }[metrics.complexity];

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-600 mb-3 px-1">Code Metrics</h3>
      <div className="flex gap-3">
        <MetricCard label="Lines" value={metrics.lineCount} colorClass="text-blue-500" />
        <MetricCard label="Functions" value={metrics.functionCount} colorClass="text-purple-500" />
        <MetricCard label="Classes" value={metrics.classCount} colorClass="text-indigo-500" />
        <MetricCard label="Complexity" value={metrics.complexity} colorClass={complexityColor} />
      </div>
    </div>
  );
};