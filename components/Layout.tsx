import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ModuleType } from '../types';

interface LayoutProps {
  activeModule: ModuleType;
  onNavigate: (module: ModuleType) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ activeModule, onNavigate, children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen bg-police-dark text-white overflow-hidden font-sans">
      <Sidebar 
        activeModule={activeModule} 
        onNavigate={onNavigate} 
        isCollapsed={isSidebarCollapsed} 
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 relative">
          {/* Background decoration */}
          <div className="fixed inset-0 pointer-events-none z-0 opacity-30 bg-grid-pattern bg-[length:40px_40px]"></div>
          <div className="relative z-10 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};