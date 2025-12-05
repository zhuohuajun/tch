import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { DataCockpit } from './components/modules/DataCockpit';
import { DataAggregation } from './components/modules/DataAggregation';
import { ComprehensiveQuery } from './components/modules/ComprehensiveQuery';
import { FamilyGraph } from './components/modules/FamilyGraph';
import { ModuleType } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleType>(ModuleType.DASHBOARD);
  const [loading, setLoading] = useState(false);

  const handleNavigate = (module: ModuleType) => {
    if (module === activeModule) return;
    setLoading(true);
    // Simulate page transition delay
    setTimeout(() => {
      setActiveModule(module);
      setLoading(false);
    }, 800);
  };

  const renderModule = () => {
    if (loading) {
        return (
            <div className="h-full w-full flex flex-col items-center justify-center animate-fade-in">
                <Loader2 size={48} className="text-police-primary animate-spin mb-4" />
                <div className="text-gray-400 text-sm tracking-widest">系统模块加载中...</div>
            </div>
        );
    }

    switch (activeModule) {
      case ModuleType.DASHBOARD:
        return <DataCockpit />;
      case ModuleType.AGGREGATION:
        return <DataAggregation />;
      case ModuleType.QUERY:
        return <ComprehensiveQuery />;
      case ModuleType.FAMILY_GRAPH:
        return <FamilyGraph />;
      default:
        return <DataCockpit />;
    }
  };

  return (
    <Layout activeModule={activeModule} onNavigate={handleNavigate}>
      {renderModule()}
    </Layout>
  );
};

export default App;