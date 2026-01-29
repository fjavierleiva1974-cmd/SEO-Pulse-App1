
import React from 'react';
import { DomainAnalysis } from '../types';
import { ShieldCheck, MousePointer2, Link, Monitor, Globe, TrendingUp, Download } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface DomainDashboardProps {
  data: DomainAnalysis;
}

const DomainDashboard: React.FC<DomainDashboardProps> = ({ data }) => {
  const exportKeywords = () => {
    const headers = ['Keyword', 'Position', 'Volume', 'Traffic'];
    const rows = data.topKeywords.map(kw => [kw.keyword, kw.pos, kw.volume, kw.traffic]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `${data.domain}_keywords.csv`);
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Authority Score', val: data.authorityScore, icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Organic Search Traffic', val: data.organicTraffic.toLocaleString(), icon: MousePointer2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Backlinks', val: data.backlinks.toLocaleString(), icon: Link, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Display Ads', val: data.displayAds?.toLocaleString() || 0, icon: Monitor, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${item.bg} ${item.color}`}>
                <item.icon size={18} />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{item.label}</span>
            </div>
            <div className="text-2xl font-bold text-slate-800">{item.val}</div>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-slate-400" />
            Organic Traffic Trend
          </h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.trafficTrend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="value" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Top Organic Keywords</h3>
            <button onClick={exportKeywords} className="text-slate-400 hover:text-indigo-600 transition-colors">
              <Download size={14} />
            </button>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white text-slate-400 uppercase font-semibold">
                <th className="px-4 py-3">Keyword</th>
                <th className="px-4 py-3">Pos</th>
                <th className="px-4 py-3">Volume</th>
                <th className="px-4 py-3">Traffic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.topKeywords.map((kw, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-indigo-600">{kw.keyword}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 font-bold">{kw.pos}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{kw.volume.toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{kw.traffic.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Main Organic Competitors</h3>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white text-slate-400 uppercase font-semibold">
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3 text-center">Common Keywords</th>
                <th className="px-4 py-3 text-right">Traffic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.mainCompetitors.map((comp, i) => (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <Globe size={14} className="text-slate-400" />
                    <span className="font-medium text-slate-700">{comp.domain}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-slate-600">{comp.commonKeywords.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600">{comp.traffic.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DomainDashboard;
