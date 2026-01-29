
import React from 'react';
import { 
  BarChart3, 
  Search, 
  Layers, 
  Globe, 
  LayoutDashboard, 
  History,
  Settings,
  HelpCircle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'keyword-overview', label: 'Keyword Overview', icon: Search },
    { id: 'keyword-magic', label: 'Keyword Magic Tool', icon: BarChart3 },
    { id: 'position-tracking', label: 'Position Tracking', icon: Layers },
    { id: 'domain-overview', label: 'Domain Overview', icon: Globe },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen fixed left-0 top-0 flex flex-col text-white z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight">SEO Pulse</span>
      </div>

      <nav className="flex-1 mt-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm font-medium ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
          <Settings size={18} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-400 hover:text-white transition-colors">
          <HelpCircle size={18} />
          Support
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
