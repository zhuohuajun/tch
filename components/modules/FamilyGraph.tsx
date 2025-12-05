import React, { useState, useEffect } from 'react';
import { Network, ZoomIn, ZoomOut, Search, ArrowLeft, User, FileText, Info, MapPin, Loader2, Footprints, FileBox, X } from 'lucide-react';

// --- Types ---

interface PersonNode {
  id: string;
  name: string;
  idCard: string;
  relationChar: string;
  relationTitle: string;
  address?: string;
  status?: string;
  details?: string;
  x: number;
  y: number;
  isRoot?: boolean;
  gender?: 'male' | 'female';
}

interface Link {
  from: string;
  to: string;
}

// --- Mock Data ---

const MOCK_SEARCH_RESULTS = [
  { id: 1, name: "张伟", idCard: "370702198501011234", address: "奎文区东风东街88号", status: "正常" },
  { id: 2, name: "张伟", idCard: "370781199005056789", address: "青州市海岱路66号", status: "重点关注" },
  { id: 3, name: "张小伟", idCard: "370702200512123344", address: "潍城区北宫西街11号", status: "正常" },
];

const GRAPH_NODES: PersonNode[] = [
  { id: '1', name: "张建国", idCard: "3707021930xxxx", relationChar: "祖", relationTitle: "祖父", x: 50, y: 10, gender: 'male' },
  { id: '2', name: "张强", idCard: "3707021955xxxx", relationChar: "父", relationTitle: "父亲", x: 50, y: 35, gender: 'male', details: "已退休，居住于奎文区。" },
  { id: '3', name: "王丽", idCard: "3707021986xxxx", relationChar: "妻", relationTitle: "配偶", x: 25, y: 60, gender: 'female', details: "某中学教师。" },
  { id: '4', name: "张伟", idCard: "370702198501011234", relationChar: "本", relationTitle: "本人", x: 50, y: 60, isRoot: true, gender: 'male', address: "奎文区东风东街88号" },
  { id: '5', name: "张军", idCard: "3707021982xxxx", relationChar: "兄", relationTitle: "胞兄", x: 75, y: 60, gender: 'male', details: "某企业职工，无前科。" },
  { id: '6', name: "张小小", idCard: "3707022010xxxx", relationChar: "女", relationTitle: "长女", x: 37.5, y: 85, gender: 'female' },
  { id: '7', name: "张小军", idCard: "3707022008xxxx", relationChar: "侄", relationTitle: "侄子", x: 75, y: 85, gender: 'male' },
];

const GRAPH_LINKS: Link[] = [
  { from: '1', to: '2' },
  { from: '2', to: '4' },
  { from: '2', to: '5' },
  { from: '4', to: '3' },
  { from: '3', to: '6' },
  { from: '4', to: '6' },
  { from: '5', to: '7' },
];

// --- Sub Components ---

const ExtraDetailModal = ({ type, data, onClose }: { type: 'archive' | 'trajectory', data: PersonNode, onClose: () => void }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    const isArchive = type === 'archive';
    const title = isArchive ? '人员全息档案' : '人员活动轨迹分析';
    const Icon = isArchive ? FileBox : Footprints;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative w-full max-w-4xl bg-police-panel border border-police-border rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-scale-in">
                {/* Header */}
                <div className="px-6 py-4 border-b border-police-border bg-police-dark/50 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Icon size={20} className="text-police-primary"/> {title}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-0 flex-1 overflow-y-auto custom-scrollbar min-h-[400px]">
                    {loading ? (
                         <div className="h-full flex flex-col items-center justify-center p-12">
                            <Loader2 size={48} className="animate-spin text-police-primary mb-4" />
                            <p className="text-gray-400 text-sm tracking-wider">正在调取公安业务库数据...</p>
                         </div>
                    ) : (
                         <div className="p-8 animate-fade-in">
                            <div className="flex items-start gap-6 mb-8">
                                <div className="w-24 h-32 bg-gray-700 rounded flex items-center justify-center border border-gray-600">
                                     <User size={48} className="text-gray-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{data.name}</h2>
                                    <p className="text-gray-400 font-mono mb-4">{data.idCard}</p>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 bg-blue-900/40 text-blue-400 rounded border border-blue-500/20 text-xs">状态正常</span>
                                        <span className="px-3 py-1 bg-green-900/40 text-green-400 rounded border border-green-500/20 text-xs">已实名</span>
                                    </div>
                                </div>
                            </div>

                            {isArchive ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="glass-panel p-4 rounded border border-police-border/30">
                                            <h4 className="text-police-primary font-bold mb-3 border-b border-police-border/20 pb-2">基础户籍信息</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between"><span className="text-gray-500">曾用名</span><span className="text-gray-300">无</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">出生地</span><span className="text-gray-300">山东省潍坊市</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">籍贯</span><span className="text-gray-300">山东潍坊</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">婚姻状况</span><span className="text-gray-300">已婚</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">文化程度</span><span className="text-gray-300">大学本科</span></div>
                                            </div>
                                        </div>
                                        <div className="glass-panel p-4 rounded border border-police-border/30">
                                            <h4 className="text-police-primary font-bold mb-3 border-b border-police-border/20 pb-2">社会关联信息</h4>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between"><span className="text-gray-500">手机号码</span><span className="text-gray-300">138****1234</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">社保状态</span><span className="text-gray-300">正常缴纳</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">车辆信息</span><span className="text-gray-300">鲁G***** (小型汽车)</span></div>
                                                <div className="flex justify-between"><span className="text-gray-500">房产信息</span><span className="text-gray-300">2套</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glass-panel p-4 rounded border border-police-border/30">
                                        <h4 className="text-police-primary font-bold mb-3 border-b border-police-border/20 pb-2">标签画像</h4>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">中共党员</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">退役军人</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">信访重点人(无)</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">吸毒前科(无)</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                     <div className="glass-panel p-4 rounded border border-police-border/30">
                                         <h4 className="text-police-primary font-bold mb-4 border-b border-police-border/20 pb-2">近30天活动轨迹热力图</h4>
                                         <div className="h-48 bg-police-dark/50 rounded flex items-center justify-center border border-white/5 relative overflow-hidden">
                                             <div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(59,130,246,0.4) 0%, transparent 40%), radial-gradient(circle at 70% 60%, rgba(16,185,129,0.4) 0%, transparent 40%)'}}></div>
                                             <MapPin className="text-gray-500 opacity-20" size={48}/>
                                             <span className="absolute text-xs text-gray-500">地图数据加载完毕</span>
                                         </div>
                                     </div>
                                     <div className="glass-panel p-4 rounded border border-police-border/30">
                                         <h4 className="text-police-primary font-bold mb-3 border-b border-police-border/20 pb-2">最新活动记录</h4>
                                         <div className="space-y-0">
                                            {[1,2,3].map(i => (
                                                <div key={i} className="flex gap-4 py-3 border-b border-white/5 last:border-0 items-start">
                                                    <div className="w-24 text-gray-500 text-xs pt-1">2023-10-{28-i}</div>
                                                    <div className="flex-1">
                                                        <div className="text-white text-sm font-medium">入住 潍坊市奎文区XX酒店</div>
                                                        <div className="text-xs text-gray-400 mt-1">数据来源：旅馆业治安管理系统</div>
                                                    </div>
                                                </div>
                                            ))}
                                         </div>
                                     </div>
                                </div>
                            )}
                         </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t border-police-border bg-police-dark/30 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded bg-police-primary text-white hover:bg-blue-600 text-sm">关闭</button>
                </div>
            </div>
        </div>
    );
};


export const FamilyGraph: React.FC = () => {
  const [view, setView] = useState<'search' | 'graph'>('search');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('4');
  const [extraModal, setExtraModal] = useState<{show: boolean, type: 'archive' | 'trajectory'}>({show: false, type: 'archive'});

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearchResults([]);
    setTimeout(() => {
        setSearchResults(MOCK_SEARCH_RESULTS);
        setLoading(false);
    }, 1500);
  };

  const enterGraph = () => {
    setView('graph');
    setSelectedNodeId('4');
  };

  const selectedNodeData = GRAPH_NODES.find(n => n.id === selectedNodeId);

  // --- Render Search View ---
  if (view === 'search') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 animate-fade-in relative">
        <div className="absolute inset-0 pointer-events-none opacity-20" 
             style={{
               backgroundImage: 'radial-gradient(circle at center, #1E3A8A 0%, transparent 70%)'
             }}>
        </div>

        <div className="w-full max-w-4xl z-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2 tracking-widest flex items-center justify-center gap-3">
              <Network className="text-police-primary" size={32} />
              人员家族关系图谱
            </h2>
            <p className="text-gray-400">请输入人员姓名或身份证号码，构建全息关系网</p>
          </div>

          {/* Search Box */}
          <div className="glass-panel p-6 rounded-xl border border-police-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.2)] mb-8">
            <form onSubmit={handleSearch} className="flex gap-4">
               <div className="flex-1 relative">
                 <User className="absolute left-3 top-3 text-gray-500" size={20}/>
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="请输入姓名 / 身份证号 (例如: 张伟)"
                   className="w-full bg-police-dark border border-police-border rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-police-primary focus:ring-1 focus:ring-police-primary transition-all"
                 />
               </div>
               <button type="submit" disabled={loading} className="px-8 py-3 bg-police-primary hover:bg-blue-600 text-white font-medium rounded-lg shadow-lg flex items-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                 {loading ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                 {loading ? '查询中' : '查询'}
               </button>
            </form>
          </div>

          {/* Loading State */}
          {loading && (
             <div className="text-center py-12 animate-fade-in">
                <Loader2 size={48} className="animate-spin text-police-primary mx-auto mb-4"/>
                <p className="text-gray-400 text-sm">正在检索人口数据库...</p>
             </div>
          )}

          {/* Results Table */}
          {!loading && searchResults.length > 0 && (
            <div className="glass-panel rounded-lg overflow-hidden border border-police-border/50 animate-slide-up">
              <div className="px-6 py-3 bg-police-dark/50 border-b border-police-border/30 text-gray-300 font-medium">
                查询结果
              </div>
              <table className="w-full text-left">
                <thead className="bg-police-panel/50 text-gray-400 text-sm">
                  <tr>
                    <th className="px-6 py-3">姓名</th>
                    <th className="px-6 py-3">身份证号</th>
                    <th className="px-6 py-3">居住地址</th>
                    <th className="px-6 py-3">状态</th>
                    <th className="px-6 py-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-police-border/20 text-sm text-gray-200">
                  {searchResults.map((person) => (
                    <tr key={person.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-bold">{person.name}</td>
                      <td className="px-6 py-4 font-mono text-gray-400">{person.idCard}</td>
                      <td className="px-6 py-4">{person.address}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs border ${person.status === '正常' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                          {person.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={enterGraph}
                          className="px-3 py-1.5 bg-police-primary/20 text-police-primary border border-police-primary/50 rounded hover:bg-police-primary hover:text-white transition-all text-xs flex items-center gap-1 ml-auto"
                        >
                          <Network size={14}/> 查看图谱
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Render Graph View ---
  return (
    <div className="h-full flex gap-4 animate-fade-in relative">
      {/* Modal Render */}
      {extraModal.show && selectedNodeData && (
          <ExtraDetailModal 
            type={extraModal.type} 
            data={selectedNodeData} 
            onClose={() => setExtraModal({...extraModal, show: false})} 
          />
      )}

      {/* Top Bar inside Graph View */}
      <div className="absolute top-4 left-4 z-20 flex gap-3">
        <button 
          onClick={() => setView('search')}
          className="px-4 py-2 bg-police-panel border border-police-border rounded-lg text-gray-300 hover:text-white hover:border-police-primary transition-all flex items-center gap-2 shadow-lg"
        >
          <ArrowLeft size={16} /> 返回搜索
        </button>
        <div className="px-4 py-2 bg-police-dark/80 backdrop-blur rounded-lg border border-police-border text-white text-sm font-medium flex items-center gap-2">
           <User size={16} className="text-police-primary"/> 当前中心人物：张伟 (370702198501011234)
        </div>
      </div>

      
      {/* Main Graph Area */}
      <div className="flex-1 glass-panel rounded-lg border border-police-border/50 relative overflow-hidden bg-police-dark select-none">
          {/* Legend Moved INSIDE Graph Area at top right */}
          <div className="absolute top-4 right-4 z-20 flex gap-2">
             <div className="bg-police-panel/90 backdrop-blur px-4 py-2 rounded-lg border border-police-border flex items-center gap-4 text-xs text-gray-300 shadow-xl">
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#F59E0B] shadow-[0_0_8px_#F59E0B]"></span> 本人</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-police-primary shadow-[0_0_8px_#3B82F6]"></span> 男性亲属</div>
                <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-pink-600 shadow-[0_0_8px_#DB2777]"></span> 女性亲属</div>
             </div>
          </div>

          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{
               backgroundImage: 'linear-gradient(#1e3a8a 1px, transparent 1px), linear-gradient(90deg, #1e3a8a 1px, transparent 1px)',
               backgroundSize: '40px 40px'
             }}>
          </div>

          {/* SVG Connection Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="28" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#1E3A8A" />
                </marker>
             </defs>
             {GRAPH_LINKS.map((link, idx) => {
               const start = GRAPH_NODES.find(n => n.id === link.from);
               const end = GRAPH_NODES.find(n => n.id === link.to);
               if (!start || !end) return null;
               
               return (
                 <line 
                   key={idx}
                   x1={`${start.x}%`} 
                   y1={`${start.y}%`} 
                   x2={`${end.x}%`} 
                   y2={`${end.y}%`} 
                   stroke="#1E3A8A" 
                   strokeWidth="2"
                   markerEnd="url(#arrowhead)"
                 />
               );
             })}
          </svg>

          {/* Nodes Layer */}
          {GRAPH_NODES.map((node) => {
             const isSelected = selectedNodeId === node.id;
             // Determine Color
             let bgColor = 'bg-police-panel';
             let borderColor = 'border-police-border';
             let textColor = 'text-gray-300';
             
             if (node.isRoot) {
               bgColor = 'bg-yellow-900/40';
               borderColor = 'border-yellow-500';
               textColor = 'text-yellow-500';
             } else if (node.gender === 'female') {
               bgColor = 'bg-pink-900/30';
               borderColor = 'border-pink-600';
               textColor = 'text-pink-400';
             } else {
               bgColor = 'bg-blue-900/30';
               borderColor = 'border-blue-500';
               textColor = 'text-blue-400';
             }

             if (isSelected) {
                bgColor = 'bg-white/10';
                textColor = 'text-white';
             }

             return (
               <div
                 key={node.id}
                 onClick={() => setSelectedNodeId(node.id)}
                 className={`
                    absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 group
                    ${isSelected ? 'scale-125 z-20' : 'hover:scale-110 z-10'}
                 `}
                 style={{ left: `${node.x}%`, top: `${node.y}%` }}
               >
                  {/* The Node Circle */}
                  <div className={`
                    w-16 h-16 rounded-full border-2 ${borderColor} ${bgColor} 
                    flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,0.5)]
                    backdrop-blur-sm
                    ${isSelected ? 'shadow-[0_0_20px_rgba(255,255,255,0.2)]' : ''}
                  `}>
                     <span className={`text-2xl font-bold font-serif ${textColor}`}>
                        {node.relationChar}
                     </span>
                  </div>

                  {/* Name Label */}
                  <div className={`
                    absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap
                    text-xs px-2 py-0.5 rounded bg-black/60 border border-white/10 text-gray-200
                  `}>
                    {node.name}
                  </div>
               </div>
             );
          })}
          
          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
             <button className="p-2 bg-police-panel border border-police-border rounded text-gray-300 hover:text-white hover:bg-police-primary/20 transition-colors shadow-lg">
                <ZoomIn size={20} />
             </button>
             <button className="p-2 bg-police-panel border border-police-border rounded text-gray-300 hover:text-white hover:bg-police-primary/20 transition-colors shadow-lg">
                <ZoomOut size={20} />
             </button>
          </div>
      </div>

      {/* Right Details Panel */}
      <div className="w-80 glass-panel rounded-lg border border-police-border/50 flex flex-col animate-slide-in-right">
         <div className="p-4 border-b border-police-border/50 bg-police-dark/30">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
               <FileText size={18} className="text-police-primary"/> 人员详情
            </h3>
         </div>
         
         {selectedNodeData ? (
           <div className="flex-1 p-5 overflow-y-auto">
              <div className="flex flex-col items-center mb-6">
                 <div className={`
                    w-20 h-20 rounded-full border-2 flex items-center justify-center mb-3 text-3xl font-serif
                    ${selectedNodeData.isRoot ? 'border-yellow-500 text-yellow-500 bg-yellow-900/20' : 'border-police-primary text-police-primary bg-blue-900/20'}
                 `}>
                    {selectedNodeData.relationChar}
                 </div>
                 <div className="text-xl font-bold text-white">{selectedNodeData.name}</div>
                 <div className="text-sm text-gray-400 mt-1">{selectedNodeData.idCard}</div>
                 <div className="mt-2 px-3 py-1 bg-white/5 rounded-full text-xs text-police-accent border border-white/10">
                    关系：{selectedNodeData.relationTitle}
                 </div>
              </div>

              <div className="space-y-4">
                 <div>
                    <div className="text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                       <MapPin size={12}/> 居住地址
                    </div>
                    <div className="text-sm text-gray-300 p-2 bg-black/20 rounded border border-white/5">
                       {selectedNodeData.address || "山东省潍坊市奎文区XXXX小区X号楼X单元"}
                    </div>
                 </div>

                 <div>
                    <div className="text-xs text-gray-500 uppercase mb-1 flex items-center gap-1">
                       <Info size={12}/> 基本情况
                    </div>
                    <div className="text-sm text-gray-300 p-2 bg-black/20 rounded border border-white/5 leading-relaxed">
                       {selectedNodeData.details || "无特殊备注信息。该人员户籍状态正常，无违法犯罪记录。"}
                    </div>
                 </div>

                 {selectedNodeData.isRoot && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-yellow-400 text-xs">
                       <p className="font-bold mb-1">重点提示：</p>
                       该人员为本次关系查询的中心节点。
                    </div>
                 )}
              </div>
           </div>
         ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <Network size={48} className="mb-4 opacity-20"/>
              <p>请点击左侧节点查看<br/>详细人员信息</p>
           </div>
         )}
         
         {selectedNodeData && (
             <div className="p-4 border-t border-police-border/30 bg-police-dark/30 flex gap-2">
                <button 
                    onClick={() => setExtraModal({show: true, type: 'archive'})}
                    className="flex-1 py-2 bg-police-primary text-white text-sm rounded hover:bg-blue-600 transition-colors shadow-lg"
                >
                   查看全档
                </button>
                <button 
                    onClick={() => setExtraModal({show: true, type: 'trajectory'})}
                    className="flex-1 py-2 bg-transparent border border-gray-600 text-gray-300 text-sm rounded hover:bg-white/5 transition-colors"
                >
                   轨迹分析
                </button>
             </div>
         )}
      </div>
    </div>
  );
};