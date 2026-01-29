
import React from 'react';
import { SERPResult } from '../types';
import { ExternalLink, Download } from 'lucide-react';

interface SerpAnalysisProps {
  serp: SERPResult[];
}

const SerpAnalysis: React.FC<SerpAnalysisProps> = ({ serp }) => {
  const exportToCSV = () => {
    const headers = ['Rank', 'Title', 'URL', 'Authority Score', 'Traffic', 'Keywords'];
    const rows = serp.map(item => [
      item.rank,
      `"${item.title.replace(/"/g, '""')}"`,
      item.url,
      item.as,
      item.traffic,
      item.keywords
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `serp_analysis_export.csv`);
    link.click();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800">SERP Analysis</h3>
          <p className="text-xs text-slate-500 mt-1">Top ranking pages for this keyword</p>
        </div>
        <button 
          onClick={exportToCSV}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <Download size={14} />
          Export
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4 w-12">Rank</th>
              <th className="px-6 py-4">Title & URL</th>
              <th className="px-6 py-4 text-center">AS</th>
              <th className="px-6 py-4 text-center">Traffic</th>
              <th className="px-6 py-4 text-center">Keywords</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {serp.map((result) => (
              <tr key={result.rank} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-center font-bold text-slate-400">
                  {result.rank}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-indigo-600 hover:underline cursor-pointer line-clamp-1">
                      {result.title}
                    </span>
                    <a 
                      href={result.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5 hover:underline"
                    >
                      {new URL(result.url).hostname}
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {result.as}
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">
                  {result.traffic.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-center text-sm text-slate-600">
                  {result.keywords.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SerpAnalysis;
