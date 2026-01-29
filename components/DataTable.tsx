
import React from 'react';
import { KeywordIdea, Intent } from '../types';
import { Download } from 'lucide-react';

interface DataTableProps {
  title: string;
  data: KeywordIdea[];
  onKeywordClick: (keyword: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ title, data, onKeywordClick }) => {
  const getIntentColor = (intent: Intent) => {
    switch (intent) {
      case Intent.INFORMATIONAL: return 'bg-blue-100 text-blue-700';
      case Intent.TRANSACTIONAL: return 'bg-purple-100 text-purple-700';
      case Intent.COMMERCIAL: return 'bg-orange-100 text-orange-700';
      case Intent.NAVIGATIONAL: return 'bg-teal-100 text-teal-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getDifficultyColor = (val: number) => {
    if (val < 30) return 'text-emerald-500';
    if (val < 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const exportToCSV = (e: React.MouseEvent) => {
    e.stopPropagation();
    const headers = ['Keyword', 'Intent', 'Volume', 'Difficulty'];
    const rows = data.map(item => [
      `"${item.keyword}"`,
      item.intent,
      item.volume,
      item.difficulty
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, '_')}_export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 font-medium">{data.length} results</span>
          <button 
            onClick={exportToCSV}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-all"
            title="Export to CSV"
          >
            <Download size={16} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-4">Keyword</th>
              <th className="px-6 py-4">Intent</th>
              <th className="px-6 py-4">Volume</th>
              <th className="px-6 py-4">KD %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((item, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-slate-50 transition-colors cursor-pointer group"
                onClick={() => onKeywordClick(item.keyword)}
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">
                  {item.keyword}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getIntentColor(item.intent)}`}>
                    {item.intent.charAt(0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.volume.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span className={getDifficultyColor(item.difficulty)}>
                    {item.difficulty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
