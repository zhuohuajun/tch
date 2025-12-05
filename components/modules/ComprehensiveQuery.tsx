import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, User, MapPin, FileText, 
  Activity, Truck, CreditCard, ChevronRight, ChevronDown, 
  Folder, FolderOpen, Eye, X, Building, Layers, List, Image as ImageIcon, Loader2
} from 'lucide-react';

// --- Types ---

type SubModuleType = 
  | 'address' 
  | 'household' 
  | 'changes' 
  | 'movements' 
  | 'floating' 
  | 'floating_linked' 
  | 'permit_accept' 
  | 'permit_card';

interface NavItem {
  id: SubModuleType;
  label: string;
  icon: React.ReactNode;
}

// --- Mock Data ---

const NAV_ITEMS: NavItem[] = [
  { id: 'address', label: '标准地址查询', icon: <MapPin size={18} /> },
  { id: 'household', label: '户籍人口查询', icon: <User size={18} /> },
  { id: 'changes', label: '变更更正查询', icon: <FileText size={18} /> },
  { id: 'movements', label: '四项变动查询', icon: <Activity size={18} /> },
  { id: 'floating', label: '流动人口查询', icon: <Truck size={18} /> },
  { id: 'floating_linked', label: '流口关联信息', icon: <Layers size={18} /> },
  { id: 'permit_accept', label: '居住证受理', icon: <FileText size={18} /> },
  { id: 'permit_card', label: '居住证证件', icon: <CreditCard size={18} /> },
];

const TREE_DATA = [
  {
    id: '370700', label: '潍坊市', expanded: true, children: [
      { id: '370702', label: '奎文区', expanded: true, children: [
          { id: '370702001', label: '东关街道派出所', expanded: false },
          { id: '370702002', label: '大虞街道派出所', expanded: false },
          { id: '370702003', label: '梨园街道派出所', expanded: false },
      ]},
      { id: '370703', label: '潍城区', expanded: false, children: [] },
      { id: '370704', label: '坊子区', expanded: false, children: [] },
      { id: '370705', label: '寒亭区', expanded: false, children: [] },
      { id: '370781', label: '青州市', expanded: false, children: [] },
    ]
  }
];

// Mock Results generator
const getMockResults = (type: SubModuleType) => {
  // Removed specific avatarUrls to restore default placeholders
  const base = [
    { id: 1, col1: "张伟", col2: "370702199001011234", col3: "男", col4: "奎文区东风东街88号", col5: "正常", detail: "详细档案信息..." },
    { id: 2, col1: "李娜", col2: "370702199205055678", col3: "女", col4: "潍城区胜利西街123号", col5: "注销", detail: "详细档案信息..." },
    { id: 3, col1: "王强", col2: "370702198812129012", col3: "男", col4: "高新区健康东街666号", col5: "正常", detail: "详细档案信息..." },
  ];

  if (type === 'address') {
    return [
      { 
        id: 1, type: "建筑物", name: "阳光100城市广场", code: "370702001001", address: "胜利东街5087号", 
        detail: "包含单元: 5个, 户室: 1200个。该建筑物为商住两用，共有32层，配备地下停车场。",
        imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=400&auto=format&fit=crop"
      },
      { 
        id: 2, type: "单元", name: "阳光100城市广场-A座", code: "37070200100101", address: "胜利东街5087号A座", 
        detail: "包含户室: 300个。位于小区南侧，紧邻主干道。",
        imageUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=400&auto=format&fit=crop"
      },
      { 
        id: 3, type: "户室", name: "阳光100城市广场-A座-1001", code: "370702001001011001", address: "胜利东街5087号A座1001室", 
        detail: "户主: 张三， 面积: 120平米， 用途: 住宅。",
        imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&auto=format&fit=crop" // Interior/Door placeholder
      },
    ];
  }
  
  if (type === 'changes') {
    return [
      { id: 1, name: "刘洋", idCard: "370781199502023333", type: "姓名变更", date: "2023-10-01", detail: "原名: 刘小洋, 现名: 刘洋" },
      { id: 2, name: "陈晨", idCard: "370781199808084444", type: "民族变更", date: "2023-09-15", detail: "原: 汉族, 现: 回族" },
    ];
  }

  return base;
};

// --- Components ---

const DetailModal = ({ data, onClose }: { data: any, onClose: () => void }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data fetching delay
    const timer = setTimeout(() => {
        setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!data) return null;

  const isAddress = data.type === '建筑物' || data.type === '单元' || data.type === '户室';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative w-[500px] h-full bg-police-panel border-l border-police-border shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-police-border flex justify-between items-center bg-police-dark/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText size={18} className="text-police-primary"/> {isAddress ? '地址详情' : '人员档案'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {loading ? (
           <div className="flex-1 flex flex-col items-center justify-center p-8">
              <Loader2 size={48} className="animate-spin text-police-primary mb-4" />
              <p className="text-gray-400 text-sm">正在调取详细档案...</p>
           </div>
        ) : (
            <>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 animate-fade-in">
                   {/* Header Section: Image + Basic Info */}
                   <div className="flex gap-4 mb-6">
                      {isAddress ? (
                         <div className="w-32 h-24 bg-gray-700 rounded border border-gray-600 flex-shrink-0 overflow-hidden relative group">
                            {data.imageUrl ? (
                                <img src={data.imageUrl} alt="Building" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                     <Building size={32} className="text-gray-500"/>
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                         </div>
                      ) : (
                         <div className="w-24 h-32 bg-gray-700 rounded border border-gray-600 flex-shrink-0 overflow-hidden shadow-lg relative flex items-center justify-center">
                             {data.avatarUrl ? (
                                 <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/>
                             ) : (
                                 <User size={48} className="text-gray-500" />
                             )}
                             <div className="absolute bottom-0 left-0 w-full bg-black/60 text-[10px] text-center text-white py-0.5 backdrop-blur-sm">
                                证件照
                             </div>
                         </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                         <div className="text-xl font-bold text-white mb-1 truncate" title={data.col1 || data.name}>{data.col1 || data.name}</div>
                         <div className="text-sm text-gray-400 font-mono mb-2">{data.col2 || data.idCard || data.code}</div>
                         
                         {isAddress && (
                             <span className="px-2 py-0.5 rounded text-xs bg-police-primary/20 text-police-primary border border-police-primary/30">
                                {data.type}
                             </span>
                         )}
                         
                         {!isAddress && (
                             <div className="flex gap-2">
                                <span className="px-2 py-0.5 rounded text-xs bg-green-900/50 text-green-400 border border-green-500/30">状态正常</span>
                                <span className="px-2 py-0.5 rounded text-xs bg-blue-900/50 text-blue-400 border border-blue-500/30">已核验</span>
                             </div>
                         )}
                      </div>
                   </div>
                   
                   <h4 className="text-sm font-bold text-police-primary mb-3 pb-1 border-b border-police-border/30">基础信息</h4>
                   <div className="grid grid-cols-1 gap-y-4 text-sm mb-6">
                      {Object.entries(data).map(([key, value]) => {
                          if (['id', 'detail', 'imageUrl', 'avatarUrl', 'type'].includes(key)) return null;
                          // Skip empty cols from mock data structure
                          if (key.startsWith('col')) {
                              // Map generic columns to labels for display if possible, or skip
                              return null; 
                          }
                          
                          // For address specifically
                          if (isAddress) {
                              const labelMap: Record<string, string> = {
                                  name: '名称', code: '编码', address: '详细地址'
                              };
                              return (
                                <div key={key} className="grid grid-cols-3 gap-2">
                                    <div className="text-gray-500 text-xs uppercase col-span-1">{labelMap[key] || key}</div>
                                    <div className="text-gray-200 col-span-2">{String(value)}</div>
                                </div>
                              );
                          }

                          // Fallback for others
                          return (
                            <div key={key}>
                                <div className="text-gray-500 text-xs mb-1 uppercase">{key}</div>
                                <div className="text-gray-200">{String(value)}</div>
                            </div>
                          )
                      })}
                      
                      {/* Display generic columns if they exist and weren't handled */}
                      {['col1', 'col2', 'col3', 'col4'].map(col => {
                         if(data[col]) {
                             return (
                                <div key={col}>
                                     <div className="text-gray-200">{String(data[col])}</div>
                                </div>
                             )
                         }
                         return null;
                      })}
                   </div>
                   
                   <h4 className="text-sm font-bold text-police-primary mb-3 pb-1 border-b border-police-border/30">
                       {isAddress ? '建筑信息概况' : '详细档案记录'}
                   </h4>
                   <div className="bg-black/20 p-3 rounded text-sm text-gray-300 leading-relaxed border border-white/5 flex items-start gap-3">
                      {isAddress && <ImageIcon size={16} className="mt-1 text-gray-500 flex-shrink-0"/>}
                      <span>{data.detail || "暂无详细描述信息。"}</span>
                   </div>
                </div>
                <div className="p-4 border-t border-police-border bg-police-dark/30 flex justify-end gap-3">
                   <button onClick={onClose} className="px-4 py-2 rounded border border-gray-600 text-gray-300 hover:bg-white/5 text-sm">关闭</button>
                   <button className="px-4 py-2 rounded bg-police-primary text-white hover:bg-blue-600 text-sm">
                       {isAddress ? '查看地图定位' : '打印档案'}
                   </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};

const TreeNode: React.FC<{ node: any, level?: number }> = ({ node, level = 0 }) => {
  const [expanded, setExpanded] = useState(node.expanded);
  
  return (
    <div>
      <div 
        className={`flex items-center py-1.5 px-2 cursor-pointer hover:bg-white/5 text-sm transition-colors ${level === 0 ? 'font-bold text-white' : 'text-gray-300'}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="mr-1 text-gray-500">
           {node.children && node.children.length > 0 ? (
               expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
           ) : <span className="w-[14px]"></span>}
        </span>
        <span className="mr-2 text-police-primary opacity-80">
            {node.children && node.children.length > 0 ? (
                expanded ? <FolderOpen size={14} /> : <Folder size={14} />
            ) : <Building size={14} />}
        </span>
        {node.label}
      </div>
      {expanded && node.children && (
        <div>
          {node.children.map((child: any) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const ComprehensiveQuery: React.FC = () => {
  const [activeSub, setActiveSub] = useState<SubModuleType>('address');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    // Simulate API delay, increased to 1.5s
    setTimeout(() => {
        setResults(getMockResults(activeSub));
        setLoading(false);
    }, 1500);
  };

  const renderSearchForm = () => {
    switch (activeSub) {
      case 'address':
        return (
          <>
            <div className="col-span-4">
               <label className="block text-xs text-gray-400 mb-1">地址层级</label>
               <select className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary">
                  <option>全部</option>
                  <option>建筑物</option>
                  <option>单元</option>
                  <option>户室</option>
               </select>
            </div>
            <div className="col-span-4">
               <label className="block text-xs text-gray-400 mb-1">门牌号/建筑物名称</label>
               <input type="text" placeholder="例如：胜利东街5087号" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
             <div className="col-span-4">
               <label className="block text-xs text-gray-400 mb-1">单元/户室号</label>
               <input type="text" placeholder="例如：1单元101" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
          </>
        );
      case 'household':
      case 'floating':
        return (
          <>
            <div className="col-span-3">
               <label className="block text-xs text-gray-400 mb-1">姓名</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
            <div className="col-span-4">
               <label className="block text-xs text-gray-400 mb-1">公民身份号码</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
             <div className="col-span-5">
               <label className="block text-xs text-gray-400 mb-1">居住/户籍地址</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
            <div className="col-span-3">
               <label className="block text-xs text-gray-400 mb-1">性别</label>
               <select className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary">
                  <option value="">全部</option>
                  <option value="1">男</option>
                  <option value="2">女</option>
               </select>
            </div>
            <div className="col-span-3">
               <label className="block text-xs text-gray-400 mb-1">民族</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
            {activeSub === 'floating' && (
               <div className="col-span-6">
                 <label className="block text-xs text-gray-400 mb-1">所属派出所</label>
                 <select className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary">
                    <option>全部</option>
                    <option>东关街道派出所</option>
                 </select>
               </div>
            )}
          </>
        );
      case 'changes':
        return (
          <>
            <div className="col-span-3">
               <label className="block text-xs text-gray-400 mb-1">姓名</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
            <div className="col-span-4">
               <label className="block text-xs text-gray-400 mb-1">公民身份号码</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
            <div className="col-span-3">
               <label className="block text-xs text-gray-400 mb-1">变更类别</label>
               <select className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
            <div className="col-span-2">
               <label className="block text-xs text-gray-400 mb-1">变更日期起</label>
               <input type="date" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
          </>
        );
      default:
        return (
           <>
            <div className="col-span-3">
               <label className="block text-xs text-gray-400 mb-1">姓名</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
            <div className="col-span-4">
               <label className="block text-xs text-gray-400 mb-1">公民身份号码</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
             <div className="col-span-5">
               <label className="block text-xs text-gray-400 mb-1">业务流水号/受理号</label>
               <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white text-sm focus:border-police-primary" />
            </div>
           </>
        );
    }
  };

  const renderTableHeaders = () => {
    if (activeSub === 'address') {
      return (
        <>
          <th className="px-4 py-3">类型</th>
          <th className="px-4 py-3">名称</th>
          <th className="px-4 py-3">标准地址编码</th>
          <th className="px-4 py-3">地址详址</th>
        </>
      );
    }
    if (activeSub === 'changes') {
       return (
        <>
          <th className="px-4 py-3">姓名</th>
          <th className="px-4 py-3">身份证号</th>
          <th className="px-4 py-3">变更类型</th>
          <th className="px-4 py-3">变更日期</th>
        </>
      );
    }
    // Default
    return (
      <>
        <th className="px-4 py-3">姓名</th>
        <th className="px-4 py-3">身份证号</th>
        <th className="px-4 py-3">性别</th>
        <th className="px-4 py-3">居住地址</th>
        <th className="px-4 py-3">状态</th>
      </>
    );
  };

  const renderTableRows = (row: any) => {
     if (activeSub === 'address') {
      return (
        <>
          <td className="px-4 py-3"><span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-xs border border-blue-500/20">{row.type}</span></td>
          <td className="px-4 py-3 font-medium text-white">{row.name}</td>
          <td className="px-4 py-3 text-gray-400 font-mono">{row.code}</td>
          <td className="px-4 py-3 text-gray-300">{row.address}</td>
        </>
      );
    }
    if (activeSub === 'changes') {
       return (
        <>
          <td className="px-4 py-3 font-medium text-white">{row.name}</td>
          <td className="px-4 py-3 text-gray-400 font-mono">{row.idCard}</td>
          <td className="px-4 py-3 text-yellow-400">{row.type}</td>
          <td className="px-4 py-3 text-gray-300">{row.date}</td>
        </>
      );
    }
    // Default
    return (
      <>
        <td className="px-4 py-3 font-medium text-white">{row.col1}</td>
        <td className="px-4 py-3 text-gray-400 font-mono">{row.col2}</td>
        <td className="px-4 py-3 text-gray-300">{row.col3}</td>
        <td className="px-4 py-3 text-gray-300 truncate max-w-xs">{row.col4}</td>
        <td className="px-4 py-3"><span className="text-green-400">{row.col5}</span></td>
      </>
    );
  };

  return (
    <div className="h-full flex gap-4 animate-fade-in">
      {/* Detail Modal */}
      {selectedItem && <DetailModal data={selectedItem} onClose={() => setSelectedItem(null)} />}

      {/* Left Navigation */}
      <div className="w-56 glass-panel rounded-lg flex flex-col border border-police-border/50 py-2">
         <div className="px-4 py-3 border-b border-police-border/30 mb-2">
            <h3 className="font-bold text-white flex items-center gap-2">
               <Search size={18} className="text-police-primary"/> 查询类别
            </h3>
         </div>
         <nav className="flex-1 overflow-y-auto space-y-1 px-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveSub(item.id); setResults([]); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-all
                  ${activeSub === item.id 
                    ? 'bg-police-primary text-white shadow-lg' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                 <span className={activeSub === item.id ? 'text-white' : 'text-police-primary/70'}>{item.icon}</span>
                 {item.label}
              </button>
            ))}
         </nav>
      </div>

      {/* Main Content Area - Unified Container */}
      <div className="flex-1 flex flex-col glass-panel rounded-lg border border-police-border/50 overflow-hidden">
         {/* Module Title Header */}
         <div className="px-5 py-4 border-b border-police-border/50 bg-police-dark/20 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                 {NAV_ITEMS.find(n => n.id === activeSub)?.icon}
                 {NAV_ITEMS.find(n => n.id === activeSub)?.label}
            </h2>
            <div className="text-xs text-gray-500">
               {activeSub === 'address' ? '通过左侧行政区划树或右侧条件进行检索' : '请输入查询条件进行检索'}
            </div>
         </div>

         <div className="flex flex-1 overflow-hidden">
            {/* Embedded Tree for Address Query - Now Inside the Main Panel */}
            {activeSub === 'address' && (
              <div className="w-64 border-r border-police-border/30 flex flex-col bg-police-dark/10 animate-slide-in-left">
                 <div className="px-3 py-2 border-b border-police-border/20 bg-police-dark/30">
                    <h3 className="font-semibold text-gray-300 text-xs flex items-center gap-2 uppercase tracking-wide">
                       <Layers size={12} className="text-police-primary"/> 行政区划导航
                    </h3>
                 </div>
                 <div className="p-2 border-b border-police-border/10">
                    <input type="text" placeholder="搜索区划..." className="w-full bg-black/20 border border-police-border/50 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-police-primary"/>
                 </div>
                 <div className="flex-1 overflow-y-auto p-2">
                     {TREE_DATA.map(node => <TreeNode key={node.id} node={node} />)}
                 </div>
              </div>
            )}

            {/* Right Side: Search Form + Table */}
            <div className="flex-1 flex flex-col overflow-hidden">
               {/* Search Form */}
               <div className="p-5 border-b border-police-border/20 bg-white/0">
                  <form onSubmit={handleSearch} className="grid grid-cols-12 gap-4">
                     {renderSearchForm()}
                     <div className="col-span-12 flex justify-end gap-3 mt-2 pt-2 border-t border-police-border/20">
                        <button type="button" className="px-4 py-2 rounded border border-gray-600 text-gray-400 hover:text-white hover:bg-white/5 text-sm flex items-center gap-2">
                           <Filter size={14}/> 重置
                        </button>
                        <button type="submit" disabled={loading} className="px-6 py-2 rounded bg-police-primary text-white hover:bg-blue-600 text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed">
                           {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14}/>}
                           {loading ? '查询中...' : '立即查询'}
                        </button>
                     </div>
                  </form>
               </div>

               {/* Result Table Area */}
               <div className="flex-1 overflow-hidden flex flex-col bg-police-dark/10">
                  <div className="px-4 py-2 bg-police-dark/40 flex justify-between items-center border-b border-police-border/20">
                     <div className="text-xs text-gray-400 flex items-center gap-1">
                        <List size={12}/> 查询结果列表
                     </div>
                     <button className="text-police-primary hover:text-white text-xs flex items-center gap-1 opacity-80 hover:opacity-100">
                        <Download size={12}/> 导出Excel
                     </button>
                  </div>
                  
                  <div className="flex-1 overflow-auto">
                     <table className="w-full text-left text-sm">
                        <thead className="bg-police-dark/50 text-gray-400 text-xs uppercase sticky top-0 z-10 backdrop-blur-sm">
                           <tr>
                              {renderTableHeaders()}
                              <th className="px-4 py-3 text-right">操作</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-police-border/20">
                           {loading ? (
                              <tr>
                                 <td colSpan={10} className="p-8 text-center text-gray-500">
                                    <div className="flex flex-col items-center justify-center py-8">
                                       <Loader2 className="animate-spin mb-3 text-police-primary" size={32}/>
                                       <span className="text-gray-400">正在检索数据...</span>
                                    </div>
                                 </td>
                              </tr>
                           ) : results.length > 0 ? (
                              results.map((row) => (
                                 <tr key={row.id} className="hover:bg-white/5 transition-colors group">
                                    {renderTableRows(row)}
                                    <td className="px-4 py-3 text-right">
                                       <button 
                                         onClick={() => setSelectedItem(row)}
                                         className="text-police-primary hover:text-white text-xs px-2 py-1 border border-police-primary/30 rounded hover:bg-police-primary/20 transition-all flex items-center gap-1 ml-auto"
                                       >
                                          <Eye size={12}/> 详情
                                       </button>
                                    </td>
                                 </tr>
                              ))
                           ) : (
                              <tr>
                                 <td colSpan={10} className="p-12 text-center text-gray-500">
                                    <Search size={32} className="mx-auto mb-2 opacity-20"/>
                                    暂无数据，请输入条件进行查询
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
                  
                  {/* Pagination */}
                  {results.length > 0 && !loading && (
                    <div className="px-4 py-2 border-t border-police-border/30 flex justify-between items-center text-xs text-gray-400 bg-police-dark/20">
                       <div>共 {results.length} 条记录</div>
                       <div className="flex gap-1">
                          <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50" disabled>上一页</button>
                          <button className="px-2 py-1 rounded bg-police-primary text-white">1</button>
                          <button className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-50" disabled>下一页</button>
                       </div>
                    </div>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};