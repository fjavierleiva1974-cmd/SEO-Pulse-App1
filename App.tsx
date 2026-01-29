
import React, { useState } from 'react';
import { Search, Loader2, Sparkles, Globe, KeyRound, ChevronDown } from 'lucide-react';
import Sidebar from './components/Sidebar';
import KeywordMetrics from './components/KeywordMetrics';
import DataTable from './components/DataTable';
import SerpAnalysis from './components/SerpAnalysis';
import DomainDashboard from './components/DomainDashboard';
import { fetchKeywordAnalysis, fetchDomainAnalysis } from './services/geminiService';
import { KeywordAnalysis, DomainAnalysis, ViewMode, SearchHistory } from './types';

const COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'BR', name: 'Brasil', flag: '🇧🇷' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('keyword-overview');
  const [searchInput, setSearchInput] = useState('');
  const [selectedRegion, setSelectedRegion] = useState(COUNTRIES[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [keywordResult, setKeywordResult] = useState<KeywordAnalysis | null>(null);
  const [domainResult, setDomainResult] = useState<DomainAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const handleSearch = async (e?: React.FormEvent, overrideQuery?: string, forceMode?: ViewMode) => {
    if (e) e.preventDefault();
    const query = overrideQuery || searchInput;
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setIsRegionOpen(false);

    const isDomain = query.includes('.') || query.startsWith('http');
    const mode: ViewMode = forceMode || (isDomain ? 'domain-overview' : 'keyword-overview');
    
    setActiveTab(mode);

    try {
      if (mode === 'domain-overview') {
        const data = await fetchDomainAnalysis(query, selectedRegion.code);
        setDomainResult(data);
        setKeywordResult(null);
      } else {
        const data = await fetchKeywordAnalysis(query, selectedRegion.code);
        setKeywordResult(data);
        setDomainResult(null);
      }
      
      const newEntry: SearchHistory = { query, type: mode, timestamp: Date.now() };
      setHistory(prev => [newEntry, ...prev.filter(h => h.query !== query)].slice(0, 10));
      setSearchInput(query);
    } catch (err: any) {
      setError(err.message || 'Error processing request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
        setActiveTab(tab);
        if (tab === 'dashboard') { setKeywordResult(null); setDomainResult(null); }
      }} />

      <main className="flex-1 ml-64 p-8">
        <header className="mb-8 max-w-6xl mx-auto">
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                {activeTab === 'domain-overview' ? <Globe size={24} /> : <KeyRound size={24} />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  {activeTab === 'domain-overview' ? 'Domain Overview' : 'Keyword Intelligence'}
                </h1>
                <p className="text-slate-500 text-sm">Targeting: <span className="font-bold text-indigo-600">{selectedRegion.name}</span> database.</p>
              </div>
            </div>
            
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-0 w-full shadow-xl rounded-2xl overflow-hidden border border-slate-200">
              {/* Region Selector */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsRegionOpen(!isRegionOpen)}
                  className="h-full px-5 py-4 bg-white border-r border-slate-100 flex items-center gap-3 hover:bg-slate-50 transition-colors min-w-[160px]"
                >
                  <span className="text-xl">{selectedRegion.flag}</span>
                  <span className="font-bold text-slate-700">{selectedRegion.code}</span>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${isRegionOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isRegionOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl mt-2 shadow-2xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => { setSelectedRegion(c); setIsRegionOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center gap-3 transition-colors ${selectedRegion.code === c.code ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'}`}
                      >
                        <span className="text-lg">{c.flag}</span>
                        <span className="text-sm font-medium">{c.name}</span>
                        <span className="ml-auto text-[10px] font-bold text-slate-400">{c.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="flex-1 relative bg-white">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder={activeTab === 'domain-overview' ? "Enter domain (e.g., apple.com)" : "Enter keyword..."}
                  className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white px-10 py-4 font-bold transition-all flex items-center justify-center gap-2 min-w-[140px]"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
              </button>
            </form>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}
        </header>

        {isLoading ? (
          <div className="max-w-6xl mx-auto py-40 flex flex-col items-center">
            <div className="relative w-24 h-24 mb-10">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-4 bg-indigo-50 rounded-full flex items-center justify-center">
                 <Sparkles className="text-indigo-600 w-8 h-8" />
               </div>
            </div>
            <p className="text-slate-900 font-extrabold text-2xl tracking-tight">AI Data aggregation...</p>
            <p className="text-slate-400 text-sm mt-3 font-medium bg-slate-100 px-4 py-1.5 rounded-full">Processing {selectedRegion.name} Market Data</p>
          </div>
        ) : domainResult ? (
          <div className="max-w-6xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <DomainDashboard data={domainResult} />
          </div>
        ) : keywordResult ? (
          <div className="max-w-6xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-800">
                  Analysis for: <span className="text-indigo-600">"{keywordResult.mainKeyword.keyword}"</span>
                </h2>
              </div>
              <KeywordMetrics metric={keywordResult.mainKeyword} />
            </section>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <DataTable title="Keyword Variations" data={keywordResult.variations} onKeywordClick={(k) => handleSearch(undefined, k, 'keyword-overview')} />
              <DataTable title="Questions" data={keywordResult.questions} onKeywordClick={(k) => handleSearch(undefined, k, 'keyword-overview')} />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-1">
                 <DataTable title="Related Keywords" data={keywordResult.related} onKeywordClick={(k) => handleSearch(undefined, k, 'keyword-overview')} />
              </div>
              <div className="xl:col-span-2">
                <SerpAnalysis serp={keywordResult.serp} />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl rotate-3">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Expert SEO Intelligence</h2>
            <p className="text-slate-500 max-w-xl text-xl mb-12 leading-relaxed font-medium">
              The only AI-powered keyword tool you need. 
              Analyze any keyword or domain in seconds with Gemini 3 Flash.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {history.length > 0 ? history.map((h, i) => (
                <button 
                  key={i}
                  onClick={() => handleSearch(undefined, h.query, h.type)}
                  className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:border-indigo-500 hover:text-indigo-600 hover:shadow-lg transition-all flex items-center gap-3"
                >
                  {h.type === 'domain-overview' ? <Globe size={16} /> : <Search size={16} />}
                  {h.query}
                </button>
              )) : (
                ['seo tools', 'digital marketing', 'apple.com'].map((q) => (
                   <button 
                    key={q}
                    onClick={() => handleSearch(undefined, q)}
                    className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-sm font-bold hover:bg-indigo-100 transition-all"
                  >
                    Try "{q}"
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
