import React, { useState } from 'react';
import { 
  Database, RefreshCw, CheckCircle, AlertCircle, FileText, 
  Server, Settings, Eye, Activity, X, Save, Clock,
  Plus, Upload, FileSpreadsheet, Download, Link
} from 'lucide-react';

// Types
interface DataSource {
  id: number;
  name: string;
  type: string;
  status: 'normal' | 'syncing' | 'error';
  lastUpdate: string;
  count: string;
}

interface LogEntry {
  id: number;
  time: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

interface DataField {
  name: string;
  type: string;
  description: string;
}

type ModalType = 'structure' | 'logs' | 'config' | 'access' | 'import' | null;

export const DataAggregation: React.FC = () => {
  // State
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  // Mock Data Sources (Updated with Household Data)
  const sources: DataSource[] = [
    { id: 6, name: "户籍人口基础数据", type: "核心库", status: "normal", lastUpdate: "2023-10-27 14:45:00", count: "9,380,123" },
    { id: 7, name: "户籍业务办理数据", type: "业务流", status: "syncing", lastUpdate: "2023-10-27 14:40:00", count: "452,100" },
    { id: 1, name: "民政局婚姻登记数据", type: "外部交换", status: "normal", lastUpdate: "2023-10-27 12:00:00", count: "12,405" },
    { id: 2, name: "卫健委出生人口数据", type: "外部交换", status: "normal", lastUpdate: "2023-10-27 10:30:00", count: "8,203" },
    { id: 3, name: "旅馆业住宿登记信息", type: "社会采集", status: "normal", lastUpdate: "2023-10-27 14:30:00", count: "45,100" },
    { id: 4, name: "网约房入住信息", type: "社会采集", status: "error", lastUpdate: "2023-10-26 23:00:00", count: "2,301" },
    { id: 5, name: "社保缴纳记录", type: "外部交换", status: "normal", lastUpdate: "2023-10-27 09:00:00", count: "890,221" },
  ];

  // Helper Actions
  const openModal = (type: ModalType, source: DataSource | null = null) => {
    setSelectedSource(source);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedSource(null);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'normal':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"><CheckCircle size={12} className="mr-1"/> 正常</span>;
      case 'syncing':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><RefreshCw size={12} className="mr-1 animate-spin"/> 同步中</span>;
      case 'error':
        return <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><AlertCircle size={12} className="mr-1"/> 异常</span>;
      default:
        return null;
    }
  };

  // Mock Content Generators for Modals
  const getStructureData = (sourceId: number): DataField[] => {
    if (sourceId === 6) { // 户籍人口
      return [
        { name: "GMSFHM", type: "VARCHAR(18)", description: "公民身份号码 (主键)" },
        { name: "XM", type: "VARCHAR(50)", description: "姓名" },
        { name: "XB", type: "CHAR(1)", description: "性别代码" },
        { name: "CSRQ", type: "DATE", description: "出生日期" },
        { name: "MZ", type: "VARCHAR(10)", description: "民族" },
        { name: "HH", type: "VARCHAR(20)", description: "户号" },
        { name: "HKSZD", type: "VARCHAR(200)", description: "户口所在地详址" },
      ];
    }
    return [
      { name: "YWID", type: "VARCHAR(32)", description: "业务流水号" },
      { name: "SLR_ID", type: "VARCHAR(18)", description: "受理人身份证号" },
      { name: "YWLX", type: "VARCHAR(20)", description: "业务类型 (迁入/迁出/注销)" },
      { name: "BLSJ", type: "DATETIME", description: "办理时间" },
      { name: "BLDW", type: "VARCHAR(50)", description: "办理单位代码" },
    ];
  };

  const getLogData = (sourceId: number): LogEntry[] => {
    return [
      { id: 1, time: "2023-10-27 14:45:01", level: "info", message: "增量同步完成，新增记录 12 条，更新 5 条。" },
      { id: 2, time: "2023-10-27 14:40:00", level: "info", message: "开始执行定时同步任务..." },
      { id: 3, time: "2023-10-27 12:00:00", level: "info", message: "全量校验完成，数据一致性 99.98%。" },
      { id: 4, time: "2023-10-27 10:15:23", level: sourceId === 4 ? "error" : "warning", message: sourceId === 4 ? "连接源数据库超时，重试 3 次失败。" : "部分字段格式不匹配，已自动清洗。" },
    ];
  };

  // --- Modals Renderers ---
  
  const renderStructureModal = () => (
    <div className="space-y-4">
      <div className="bg-police-dark/50 p-3 rounded border border-police-border/30 mb-4 text-sm text-gray-300">
        <span className="text-police-primary font-bold">数据源：</span> {selectedSource?.name}
        <span className="mx-4">|</span>
        <span className="text-police-primary font-bold">表名：</span> T_POP_HJ_BASIC
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-police-panel text-gray-400">
          <tr>
            <th className="px-4 py-2">字段名</th>
            <th className="px-4 py-2">数据类型</th>
            <th className="px-4 py-2">中文描述</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-police-border/20">
          {selectedSource && getStructureData(selectedSource.id).map((field, idx) => (
            <tr key={idx} className="hover:bg-white/5">
              <td className="px-4 py-2 font-mono text-blue-300">{field.name}</td>
              <td className="px-4 py-2 text-yellow-500">{field.type}</td>
              <td className="px-4 py-2 text-gray-300">{field.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderLogsModal = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
         <h4 className="text-sm font-medium text-white">最近24小时日志</h4>
         <button className="text-xs text-police-primary hover:text-white flex items-center gap-1"><RefreshCw size={12}/> 刷新</button>
      </div>
      <div className="bg-black/20 rounded-lg p-2 max-h-[400px] overflow-y-auto space-y-2">
        {selectedSource && getLogData(selectedSource.id).map((log) => (
          <div key={log.id} className="flex gap-3 text-sm p-2 border-b border-white/5 last:border-0">
             <div className="text-gray-500 font-mono text-xs whitespace-nowrap pt-1">{log.time}</div>
             <div className="flex-1">
                <div className={`flex items-center gap-2 mb-1 ${
                  log.level === 'error' ? 'text-red-400' : 
                  log.level === 'warning' ? 'text-yellow-400' : 'text-green-400'
                }`}>
                   {log.level === 'error' ? <AlertCircle size={14}/> : 
                    log.level === 'warning' ? <AlertCircle size={14}/> : <CheckCircle size={14}/>}
                   <span className="uppercase font-bold text-xs">{log.level}</span>
                </div>
                <div className="text-gray-300">{log.message}</div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConfigModal = () => (
    <div className="space-y-5">
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">任务名称</label>
            <input type="text" defaultValue={selectedSource?.name} className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">同步策略</label>
            <select className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary">
               <option>实时同步 (CDC)</option>
               <option>定时增量 (每15分钟)</option>
               <option>定时全量 (每日凌晨)</option>
            </select>
          </div>
       </div>
       <div>
            <label className="block text-xs text-gray-400 mb-1">接口地址 / JDBC URL</label>
            <input type="text" defaultValue="jdbc:mysql://10.X.X.X:3306/weifang_pop_db?useSSL=false" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-police-primary" />
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">用户名</label>
            <input type="text" defaultValue="sync_user_ro" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">密码</label>
            <input type="password" defaultValue="******" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary" />
          </div>
       </div>
       <div className="pt-2 flex items-center gap-2">
         <input type="checkbox" id="clean" className="rounded bg-police-dark border-police-border" defaultChecked />
         <label htmlFor="clean" className="text-sm text-gray-300">启用自动数据清洗规则</label>
       </div>
    </div>
  );

  const renderAccessModal = () => (
    <div className="space-y-5">
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">数据源名称</label>
            <input type="text" placeholder="例如：某某局业务库" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">数据源类型</label>
            <select className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary">
               <option>MySQL 数据库</option>
               <option>Oracle 数据库</option>
               <option>REST API 接口</option>
               <option>FTP 文件服务器</option>
            </select>
          </div>
       </div>
       <div>
            <label className="block text-xs text-gray-400 mb-1">连接地址 (URL)</label>
            <input type="text" placeholder="jdbc:mysql://..." className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-police-primary" />
       </div>
       <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 mb-1">用户名</label>
            <input type="text" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary" />
          </div>
          <div>
            <label className="block text-xs text-gray-400 mb-1">密码</label>
            <input type="password" className="w-full bg-police-dark border border-police-border rounded px-3 py-2 text-white focus:outline-none focus:border-police-primary" />
          </div>
       </div>
       <div className="bg-blue-900/20 p-3 rounded border border-blue-500/20 flex justify-between items-center">
          <span className="text-xs text-blue-300">配置完成后请先测试连通性</span>
          <button className="px-3 py-1 bg-transparent border border-police-primary text-police-primary text-xs rounded hover:bg-police-primary hover:text-white transition-colors">
            测试连接
          </button>
       </div>
    </div>
  );

  const renderImportModal = () => (
    <div className="space-y-4">
        <div className="bg-police-dark/50 p-3 rounded border border-police-border/30 mb-2 text-sm text-gray-300">
           <span className="text-police-primary font-bold">目标数据源：</span> {selectedSource?.name}
        </div>
        
        <div className="border-2 border-dashed border-police-border/50 rounded-lg p-8 flex flex-col items-center justify-center hover:bg-white/5 hover:border-police-primary transition-all cursor-pointer group bg-black/20">
            <div className="w-16 h-16 rounded-full bg-police-panel flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg">
               <FileSpreadsheet size={32} className="text-green-500" />
            </div>
            <p className="text-gray-300 font-medium mb-1">点击或拖拽 Excel 文件至此处</p>
            <p className="text-xs text-gray-500">支持 .xlsx, .xls, .csv 格式 (最大 50MB)</p>
        </div>

        <div className="flex justify-between items-center px-2">
            <button className="text-police-primary text-xs flex items-center gap-1 hover:text-white transition-colors opacity-80 hover:opacity-100">
                <Download size={14}/> 下载标准导入模板
            </button>
            <div className="text-xs text-gray-500">
                上次导入: <span className="text-gray-400">无记录</span>
            </div>
        </div>
    </div>
  );


  // --- Main Render ---
  return (
    <div className="space-y-6 animate-fade-in relative h-full flex flex-col">
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-4">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Database className="text-police-primary" /> 数据汇聚中心
           </h2>
           <p className="text-gray-400 text-sm mt-1">实时监控各委办局数据接入与清洗状态</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => openModal('access')}
                className="px-4 py-2 bg-police-primary text-white rounded hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
                <Plus size={16} /> 数据接入配置
            </button>
            <button className="px-4 py-2 bg-police-panel border border-police-primary/50 text-police-primary rounded hover:bg-police-primary/10 transition-colors flex items-center gap-2">
                <FileText size={16} /> 生成汇聚报告
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="glass-panel p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                <Server size={32} />
            </div>
            <div>
                <div className="text-gray-400 text-sm">接入数据源总数</div>
                <div className="text-2xl font-bold text-white">{sources.length} <span className="text-sm text-gray-500 font-normal">个</span></div>
            </div>
        </div>
         <div className="glass-panel p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                <Database size={32} />
            </div>
            <div>
                <div className="text-gray-400 text-sm">今日汇聚数据量</div>
                <div className="text-2xl font-bold text-white">9,832,223 <span className="text-sm text-gray-500 font-normal">条</span></div>
            </div>
        </div>
         <div className="glass-panel p-6 rounded-lg flex items-center gap-4">
            <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400">
                <AlertCircle size={32} />
            </div>
            <div>
                <div className="text-gray-400 text-sm">清洗异常数据</div>
                <div className="text-2xl font-bold text-white">234 <span className="text-sm text-gray-500 font-normal">条</span></div>
            </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-lg overflow-hidden border border-police-border/50 flex-1 flex flex-col">
        <div className="px-6 py-4 border-b border-police-border/50 bg-police-dark/30 flex justify-between items-center">
            <h3 className="font-semibold text-white">数据源状态列表</h3>
             <div className="text-xs text-gray-400 flex items-center gap-2">
                <Clock size={12}/> 数据自动刷新中
             </div>
        </div>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-police-dark/50 text-gray-400 text-xs uppercase tracking-wider sticky top-0 backdrop-blur-sm z-10">
              <tr>
                <th className="px-6 py-3 font-medium">数据源名称</th>
                <th className="px-6 py-3 font-medium">来源类型</th>
                <th className="px-6 py-3 font-medium">状态</th>
                <th className="px-6 py-3 font-medium">总量</th>
                <th className="px-6 py-3 font-medium">最后更新时间</th>
                <th className="px-6 py-3 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-police-border/30 text-sm">
              {sources.map((source) => (
                <tr key={source.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-police-primary"></div>
                     {source.name}
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                      <span className="bg-white/5 px-2 py-1 rounded text-xs border border-white/10">{source.type}</span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(source.status)}</td>
                  <td className="px-6 py-4 text-white font-mono">{source.count}</td>
                  <td className="px-6 py-4 text-gray-400">{source.lastUpdate}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openModal('import', source)} className="text-gray-400 hover:text-green-400 transition-colors tooltip" title="手动导入表格">
                            <Upload size={16} />
                        </button>
                        <button onClick={() => openModal('structure', source)} className="text-gray-400 hover:text-police-primary transition-colors tooltip" title="查看结构">
                            <Eye size={16} />
                        </button>
                        <button onClick={() => openModal('logs', source)} className="text-gray-400 hover:text-yellow-400 transition-colors tooltip" title="查看日志">
                            <Activity size={16} />
                        </button>
                        <button onClick={() => openModal('config', source)} className="text-gray-400 hover:text-blue-400 transition-colors tooltip" title="配置">
                            <Settings size={16} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Overlay */}
      {activeModal && (selectedSource || activeModal === 'access') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeModal}></div>
            <div className="relative w-full max-w-2xl bg-police-panel border border-police-border rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-scale-in">
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-police-border bg-police-dark/50">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {activeModal === 'structure' && <><Eye size={20} className="text-police-primary"/> 数据结构查看</>}
                        {activeModal === 'logs' && <><Activity size={20} className="text-yellow-400"/> 系统运行日志</>}
                        {activeModal === 'config' && <><Settings size={20} className="text-blue-400"/> 数据源配置</>}
                        {activeModal === 'access' && <><Link size={20} className="text-white"/> 接入新数据源</>}
                        {activeModal === 'import' && <><Upload size={20} className="text-green-400"/> 人工数据导入</>}
                    </h3>
                    <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {activeModal === 'structure' && renderStructureModal()}
                    {activeModal === 'logs' && renderLogsModal()}
                    {activeModal === 'config' && renderConfigModal()}
                    {activeModal === 'access' && renderAccessModal()}
                    {activeModal === 'import' && renderImportModal()}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-police-border bg-police-dark/30 flex justify-end gap-3">
                    <button onClick={closeModal} className="px-4 py-2 rounded text-sm text-gray-300 hover:bg-white/10 transition-colors">
                        关闭
                    </button>
                    {(activeModal === 'config' || activeModal === 'access') && (
                         <button onClick={closeModal} className="px-4 py-2 rounded text-sm bg-police-primary text-white hover:bg-blue-600 transition-colors flex items-center gap-2 shadow-lg">
                            <Save size={16} /> 保存配置
                        </button>
                    )}
                    {activeModal === 'import' && (
                         <button onClick={closeModal} className="px-4 py-2 rounded text-sm bg-green-600 text-white hover:bg-green-500 transition-colors flex items-center gap-2 shadow-lg">
                            <Upload size={16} /> 开始导入
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};