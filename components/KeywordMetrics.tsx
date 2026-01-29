
import React from 'react';
import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { KeywordMetric } from '../types';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  color: string;
  difficulty?: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subValue, icon, color, difficulty }) => {
  const getDifficultyColor = (val: number) => {
    if (val < 30) return 'text-emerald-500';
    if (val < 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getDifficultyLabel = (val: number) => {
    if (val < 30) return 'Easy';
    if (val < 50) return 'Possible';
    if (val < 75) return 'Hard';
    return 'Very Hard';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-sm font-medium uppercase tracking-wider">{label}</span>
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-slate-800">{value}</span>
        {difficulty !== undefined ? (
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-sm font-bold ${getDifficultyColor(difficulty)}`}>
              {difficulty}% {getDifficultyLabel(difficulty)}
            </span>
          </div>
        ) : (
          <span className="text-sm text-slate-400 mt-1">{subValue}</span>
        )}
      </div>
    </div>
  );
};

interface KeywordMetricsProps {
  metric: KeywordMetric;
}

const KeywordMetrics: React.FC<KeywordMetricsProps> = ({ metric }) => {
  // Mock data for the trend sparkline chart
  const trendData = metric.trend.map((val, idx) => ({ month: idx, value: val }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard 
        label="Search Volume" 
        value={metric.volume.toLocaleString()} 
        subValue="Estimated visits per month" 
        icon={<Users className="w-5 h-5 text-indigo-600" />}
        color="bg-indigo-600"
      />
      <MetricCard 
        label="Keyword Difficulty" 
        value={`${metric.difficulty}%`}
        difficulty={metric.difficulty}
        icon={<TrendingUp className="w-5 h-5 text-amber-600" />}
        color="bg-amber-600"
      />
      <MetricCard 
        label="Intent" 
        value={metric.intent}
        subValue="User search purpose"
        icon={<Target className="w-5 h-5 text-emerald-600" />}
        color="bg-emerald-600"
      />
      <MetricCard 
        label="CPC" 
        value={`$${metric.cpc.toFixed(2)}`}
        subValue="Average cost per click"
        icon={<DollarSign className="w-5 h-5 text-rose-600" />}
        color="bg-rose-600"
      />

      {/* Trend Analysis Box */}
      <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-200 mt-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Search Volume Trend (12 Months)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => `Month ${label + 1}`}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#4f46e5" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default KeywordMetrics;
