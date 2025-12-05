import React from 'react';
import { ModuleType, NavItem } from '../types';
import { LayoutDashboard, Database, Search, Network } from 'lucide-react';

interface SidebarProps {
  activeModule: ModuleType;
  onNavigate: (module: ModuleType) => void;
  isCollapsed: boolean;
}

// Police Badge Icon Component
const PoliceBadgeIcon = () => (
  <svg viewBox="0 0 100 120" className="w-10 h-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.6)]">
    {/* Outer Shield Glow */}
    <defs>
      <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="50%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
    </defs>
    
    {/* Shield Body */}
    <path 
      d="M50 5 L90 20 V50 C90 80 50 110 50 110 C50 110 10 80 10 50 V20 L50 5 Z" 
      fill="url(#shieldGrad)" 
      stroke="#fbbf24" 
      strokeWidth="2" 
    />
    
    {/* Inner Detail Lines */}
    <path d="M50 15 V100" stroke="#fbbf24" strokeWidth="0.5" strokeOpacity="0.3" />
    <path d="M20 50 H80" stroke="#fbbf24" strokeWidth="0.5" strokeOpacity="0.3" />

    {/* Star */}
    <path 
      d="M50 30 L56 48 L75 48 L60 60 L66 78 L50 68 L34 78 L40 60 L25 48 L44 48 Z" 
      fill="#fbbf24" 
      stroke="#b45309" 
      strokeWidth="1"
    />
    
    {/* Text "公安" (Small representation) */}
    <path d="M35 90 Q50 95 65 90" stroke="#fbbf24" strokeWidth="2" fill="none" />
  </svg>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeModule, onNavigate, isCollapsed }) => {
  const navItems: NavItem[] = [
    { id: ModuleType.DASHBOARD, label: '数据驾驶舱', icon: <LayoutDashboard size={20} /> },
    { id: ModuleType.AGGREGATION, label: '数据汇聚', icon: <Database size={20} /> },
    { id: ModuleType.QUERY, label: '综合查询', icon: <Search size={20} /> },
    { id: ModuleType.FAMILY_GRAPH, label: '人员家族图谱', icon: <Network size={20} /> },
  ];

  return (
    <aside 
      className={`
        bg-police-panel border-r border-police-border transition-all duration-300 flex flex-col h-full shadow-2xl z-30
        ${isCollapsed ? 'w-16' : 'w-64'}
      `}
    >
      <div className={`h-20 flex items-center border-b border-police-border bg-police-dark/80 backdrop-blur-sm ${isCollapsed ? 'justify-center' : 'px-4'}`}>
          <div className="flex items-center gap-3 w-full overflow-hidden">
             <div className="flex-shrink-0 flex items-center justify-center">
               <PoliceBadgeIcon />
             </div>
             
             {!isCollapsed && (
                 <div className="flex flex-col min-w-0 animate-fade-in">
                    <span className="text-white font-bold text-base truncate tracking-wide leading-none mb-1 text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                        人口数据回流应用
                    </span>
                    <span className="text-police-accent text-[10px] truncate opacity-80 origin-left uppercase tracking-widest">
                        Weifang Police
                    </span>
                 </div>
             )}
          </div>
      </div>

      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                w-full flex items-center px-4 py-3 transition-colors duration-200 group relative
                ${isActive 
                  ? 'text-white bg-gradient-to-r from-blue-900/60 to-transparent border-l-4 border-police-primary' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}
              `}
              title={isCollapsed ? item.label : ''}
            >
              <span className={`${isActive ? 'text-police-primary drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]' : ''}`}>
                {item.icon}
              </span>
              
              {!isCollapsed && (
                <span className="ml-3 font-medium tracking-wide">
                  {item.label}
                </span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-gray-700">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-police-border text-center text-xs text-gray-500">
        {!isCollapsed && <p>v1.0.0 Build 2023</p>}
      </div>
    </aside>
  );
};