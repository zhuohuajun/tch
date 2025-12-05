import React, { useState, useEffect } from 'react';
import { Menu, Bell, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { APP_SUBTITLE, MOCK_USER } from '../constants';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = time.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const weekDay = time.toLocaleDateString('zh-CN', { weekday: 'long' });
  const timeStr = time.toLocaleTimeString('zh-CN', { hour12: false });

  return (
    <header className="h-16 bg-police-panel border-b border-police-border flex items-center justify-between px-4 shadow-lg z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-colors"
        >
          <Menu size={24} />
        </button>
        
        {/* Optional: Add current page title or system subtitle here if needed, keeping it clean for now */}
        <div className="hidden md:block">
           <span className="text-xs text-police-primary uppercase tracking-widest opacity-80">
            {APP_SUBTITLE}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Real-time System Time */}
        <div className="hidden md:block text-right">
          <div className="text-sm font-medium text-blue-100">{dateStr}</div>
          <div className="text-xs text-blue-400 font-mono">{weekDay} {timeStr}</div>
        </div>

        <div className="h-8 w-px bg-police-border mx-2"></div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-white">{MOCK_USER.name}</div>
              <div className="text-xs text-gray-400">{MOCK_USER.department} · {MOCK_USER.rank}</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-700 border-2 border-police-primary overflow-hidden">
               <div className="w-full h-full flex items-center justify-center bg-blue-900 text-white">
                 <UserIcon size={20} />
               </div>
            </div>
            <div className="flex flex-col gap-1">
                <button className="text-gray-400 hover:text-white" title="设置">
                    <Settings size={16} />
                </button>
                 <button className="text-gray-400 hover:text-red-400" title="退出">
                    <LogOut size={16} />
                </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};