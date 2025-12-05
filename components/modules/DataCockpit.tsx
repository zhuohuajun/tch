import React, { useState, useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, 
  Tooltip, Legend, AreaChart, Area, CartesianGrid, LineChart, Line 
} from 'recharts';
import { 
  Users, UserPlus, Shield, Map, Layout, Activity, 
  BadgeCheck, School, Truck, UserCheck, Baby, UserMinus, LogIn, LogOut
} from 'lucide-react';

// --- Types & Constants ---

type TabType = 'overview' | 'registered' | 'floating';
type RegionType = '全市' | '奎文区' | '潍城区' | '坊子区' | '寒亭区' | '青州市' | '诸城市' | '寿光市' | '安丘市' | '高密市' | '昌邑市' | '临朐县' | '昌乐县';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const GENDER_COLORS = ['#3B82F6', '#EC4899']; // Blue for Male, Pink for Female

// Mock Data Generator based on Region
const getRegionData = (region: RegionType) => {
  // Simulate different scales for districts/counties
  let multiplier = 0.1;
  if (region === '全市') multiplier = 1;
  else if (['寿光市', '诸城市', '青州市'].includes(region)) multiplier = 0.15; // Larger county-level cities
  else if (['奎文区', '潍城区'].includes(region)) multiplier = 0.08; // Core districts

  const civilPoliceCount = Math.floor(4500 * multiplier) || 120;
  const auxPoliceCount = Math.floor(6200 * multiplier) || 200;
  const communityPoliceCount = Math.floor(civilPoliceCount * 0.35); 

  // Floating Population Calc
  const floatingTotal = Math.floor(2105600 * multiplier);
  const permitRateVal = 85 + Math.random() * 10;
  const permitCount = Math.floor(floatingTotal * (permitRateVal / 100));

  return {
    overview: {
      stations: Math.floor(168 * multiplier) || 5,
      police: civilPoliceCount,
      auxiliary: auxPoliceCount,
      communityPolice: communityPoliceCount,
      forceStructure: [
        { name: '民警', value: civilPoliceCount },
        { name: '辅警', value: auxPoliceCount },
      ],
      policeAge: [
        { name: '25岁以下', value: Math.floor(civilPoliceCount * 0.05) },
        { name: '26-35岁', value: Math.floor(civilPoliceCount * 0.35) },
        { name: '36-45岁', value: Math.floor(civilPoliceCount * 0.40) },
        { name: '46岁以上', value: Math.floor(civilPoliceCount * 0.20) },
      ],
      policeGender: [
        { name: '男', value: Math.floor(civilPoliceCount * 0.85) },
        { name: '女', value: Math.floor(civilPoliceCount * 0.15) },
      ],
      auxAge: [
        { name: '25岁以下', value: Math.floor(auxPoliceCount * 0.25) },
        { name: '26-35岁', value: Math.floor(auxPoliceCount * 0.45) },
        { name: '36-45岁', value: Math.floor(auxPoliceCount * 0.20) },
        { name: '46岁以上', value: Math.floor(auxPoliceCount * 0.10) },
      ],
      auxGender: [
        { name: '男', value: Math.floor(auxPoliceCount * 0.70) },
        { name: '女', value: Math.floor(auxPoliceCount * 0.30) },
      ]
    },
    registered: {
      total: Math.floor(9380123 * multiplier),
      growthRate: (0.45 + Math.random() * 0.2).toFixed(2),
      genderData: [
        { name: '男性', value: 50 + Math.floor(Math.random() * 2) },
        { name: '女性', value: 50 - Math.floor(Math.random() * 2) },
      ],
      ageDist: [
        { name: '0-14岁', value: Math.floor(1200 * multiplier) },
        { name: '15-59岁', value: Math.floor(4500 * multiplier) },
        { name: '60岁+', value: Math.floor(1800 * multiplier) },
      ],
      trend: [
        { name: '2019', value: Math.floor(890 * multiplier) },
        { name: '2020', value: Math.floor(910 * multiplier) },
        { name: '2021', value: Math.floor(925 * multiplier) },
        { name: '2022', value: Math.floor(932 * multiplier) },
        { name: '2023', value: Math.floor(938 * multiplier) },
      ],
      fourChanges: {
          birth: Math.floor(8500 * multiplier),
          death: Math.floor(6200 * multiplier),
          moveIn: Math.floor(12500 * multiplier),
          moveOut: Math.floor(9800 * multiplier)
      }
    },
    floating: {
      total: floatingTotal,
      separation: Math.floor(floatingTotal * 0.18), // Person-Household Separation
      permitRate: permitRateVal.toFixed(1),
      permitCount: permitCount,
      sourceData: [
        { name: '省内其他', value: 45 },
        { name: '河南', value: 15 },
        { name: '黑龙江', value: 12 },
        { name: '河北', value: 8 },
        { name: '其他', value: 20 },
      ],
      trend: [
        { name: '1月', value: Math.floor(210 * multiplier) },
        { name: '2月', value: Math.floor(180 * multiplier) },
        { name: '3月', value: Math.floor(250 * multiplier) },
        { name: '4月', value: Math.floor(280 * multiplier) },
        { name: '5月', value: Math.floor(300 * multiplier) },
        { name: '6月', value: Math.floor(310 * multiplier) },
      ],
      ageDist: [
        { name: '18-25岁', value: Math.floor(floatingTotal * 0.20) },
        { name: '26-45岁', value: Math.floor(floatingTotal * 0.60) },
        { name: '46岁+', value: Math.floor(floatingTotal * 0.20) },
      ],
      genderData: [
        { name: '男性', value: Math.floor(floatingTotal * 0.55) },
        { name: '女性', value: Math.floor(floatingTotal * 0.45) },
      ]
    }
  };
};

// --- Components ---

const StatCard = ({ title, value, unit, icon, color, subText }: any) => (
  <div className="glass-panel p-4 rounded-lg border-l-4 border-l-police-primary relative overflow-hidden group hover:bg-white/5 transition-all">
    <div className={`absolute right-2 top-2 p-2 rounded-full bg-${color}-500/10 text-${color}-400 group-hover:scale-110 transition-transform`}>
        {icon}
    </div>
    <h3 className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">{title}</h3>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl font-bold text-white font-mono">{typeof value === 'number' ? value.toLocaleString() : value}</span>
      {unit && <span className="text-xs text-gray-500">{unit}</span>}
    </div>
    {subText && <div className="mt-2 text-xs text-gray-500">{subText}</div>}
  </div>
);

const SectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-white font-medium mb-3 flex items-center gap-2 pl-2 border-l-4 border-police-primary text-sm tracking-wide">
    {title}
  </h3>
);

// Weifang Map SVG with precise topology matching the reference image
const WeifangMap = ({ selected, onSelect }: { selected: RegionType, onSelect: (r: RegionType) => void }) => {
  // ViewBox 500 x 400
  // Topology logic matches the provided image:
  // Shouguang (NW), Hanting (N Center), Changyi (NE)
  // Qingzhou (W), Changle (W Center), Weicheng/Kuiwen (Center Core), Fangzi (E Center), Gaomi (E)
  // Linqu (SW), Anqiu (S Center), Zhucheng (SE)
  
  const regions: { id: RegionType, d: string, cx: number, cy: number, color?: string }[] = [
    // 1. Shouguang (寿光) - Top Left, big block
    { 
      id: '寿光市', 
      d: "M130,40 L230,50 L245,130 L210,165 L180,165 L100,140 L80,100 Z", 
      cx: 160, cy: 110,
      color: "#5C6B7F" // Greyish
    },
    // 2. Hanting (寒亭) - Top Middle
    { 
      id: '寒亭区', 
      d: "M230,50 L310,40 L320,135 L285,150 L270,140 L245,130 Z", 
      cx: 280, cy: 90,
      color: "#94A3B8" // Light Grey
    },
    // 3. Changyi (昌邑) - Top Right
    { 
      id: '昌邑市', 
      d: "M310,40 L410,30 L430,140 L360,160 L320,135 Z", 
      cx: 370, cy: 90,
      color: "#60A5FA" // Blue
    },
    // 4. Weicheng (潍城区) - Center Core (Left)
    { 
      id: '潍城区', 
      d: "M210,165 L245,160 L245,190 L215,190 Z", 
      cx: 230, cy: 175,
      color: "#14B8A6" // Teal
    },
    // 5. Kuiwen (奎文区) - Center Core (Right)
    { 
      id: '奎文区', 
      d: "M245,160 L270,155 L285,150 L285,185 L260,190 L245,190 Z", 
      cx: 265, cy: 170,
      color: "#CBD5E1" // Light Grey
    },
    // 6. Fangzi (坊子区) - East/South of Core
    { 
      id: '坊子区', 
      d: "M285,150 L320,135 L360,160 L340,220 L290,260 L260,250 L260,190 L285,185 Z", 
      cx: 310, cy: 200,
      color: "#C084FC" // Purple
    },
    // 7. Changle (昌乐县) - West of Core
    { 
      id: '昌乐县', 
      d: "M180,165 L210,165 L215,190 L260,250 L220,260 L130,220 L135,170 Z", 
      cx: 190, cy: 220,
      color: "#86EFAC" // Light Green
    },
    // 8. Qingzhou (青州市) - Far West
    { 
      id: '青州市', 
      d: "M20,130 L100,140 L135,170 L130,220 L80,260 L20,220 Z", 
      cx: 75, cy: 190,
      color: "#7DD3FC" // Light Blue
    },
    // 9. Gaomi (高密市) - Far East
    { 
      id: '高密市', 
      d: "M360,160 L430,140 L480,240 L400,280 L340,220 Z", 
      cx: 410, cy: 220,
      color: "#4ADE80" // Green
    },
    // 10. Linqu (临朐县) - South West
    { 
      id: '临朐县', 
      d: "M20,220 L80,260 L130,240 L150,290 L120,350 L40,300 Z", 
      cx: 80, cy: 290,
      color: "#2DD4BF" // Teal/Cyan
    },
    // 11. Anqiu (安丘市) - South Center
    { 
      id: '安丘市', 
      d: "M150,290 L130,240 L220,260 L290,260 L300,320 L220,350 Z", 
      cx: 220, cy: 300,
      color: "#34D399" // Emerald
    },
    // 12. Zhucheng (诸城市) - South East
    { 
      id: '诸城市', 
      d: "M340,220 L400,280 L440,360 L320,380 L300,320 L290,260 Z", 
      cx: 370, cy: 320,
      color: "#38BDF8" // Sky Blue
    },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
       {/* Background Grid */}
       <div className="absolute inset-0 z-0 opacity-30" 
           style={{
             backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>
      
      {/* City Label */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
         <div className="text-2xl font-bold text-white tracking-widest flex items-center gap-2 drop-shadow-md">
            <Map className="text-police-primary" />
            {selected}
         </div>
         <div className="text-xs text-police-accent mt-1 uppercase tracking-widest opacity-80">Weifang City Data Map</div>
      </div>
      
      {selected !== '全市' && (
        <button 
            onClick={() => onSelect('全市')}
            className="absolute top-20 left-4 z-20 text-xs bg-police-primary/20 text-police-primary px-3 py-1.5 rounded border border-police-primary/50 hover:bg-police-primary hover:text-white transition-colors flex items-center gap-1 shadow-lg backdrop-blur-sm"
        >
            <Layout size={12}/> 返回全市
        </button>
      )}

      <svg viewBox="0 0 500 420" className="w-full h-full max-h-[550px] z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
         <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
            <filter id="inner-glow">
                <feFlood floodColor="rgba(255, 255, 255, 0.2)"/>
                <feComposite in2="SourceAlpha" operator="in"/>
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
            </filter>
         </defs>
         
         {/* Render Regions */}
         {regions.map((r) => {
            const isSelected = selected === r.id;
            // Determine fill color: if selected, bright blue; if not, use the map color or default dark blue
            const baseFill = r.color || '#1e3a8a';
            
            return (
              <g key={r.id} onClick={() => onSelect(r.id)} className="cursor-pointer group">
                <path 
                  d={r.d} 
                  fill={isSelected ? '#3B82F6' : baseFill}
                  fillOpacity={isSelected ? 0.9 : 0.6} // Slightly transparent to show grid
                  stroke={isSelected ? '#FFFFFF' : '#1e293b'} // White stroke when selected, dark when not
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-300 ease-out hover:fill-opacity-80"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  filter={isSelected ? "url(#glow)" : ""}
                />
                
                {/* Region Label */}
                <text 
                    x={r.cx} 
                    y={r.cy} 
                    textAnchor="middle" 
                    alignmentBaseline="middle"
                    className={`text-[10px] pointer-events-none transition-all duration-300 select-none font-medium
                        ${isSelected ? 'fill-white font-bold text-sm' : 'fill-white/80'}`}
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                >
                    {r.id.replace(/[市区县]/g, '')}
                </text>
              </g>
            );
         })}
      </svg>
    </div>
  );
};


export const DataCockpit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('全市');
  
  // Memoize data calculation to avoid jitter
  const data = useMemo(() => getRegionData(selectedRegion), [selectedRegion]);

  const tabs: { id: TabType, label: string, icon: any }[] = [
    { id: 'overview', label: '辖区概况驾驶舱', icon: Shield },
    { id: 'registered', label: '户籍人口驾驶舱', icon: BadgeCheck },
    { id: 'floating', label: '流动人口驾驶舱', icon: Truck },
  ];

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in pb-4">
      {/* Tab Navigation */}
      <div className="flex justify-center mb-2">
        <div className="glass-panel p-1 rounded-lg flex gap-2 border border-police-primary/30">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-6 py-2 rounded-md transition-all duration-300 text-sm font-medium
                  ${activeTab === tab.id 
                    ? 'bg-police-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}
                `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
        
        {/* Left Panel: Key Stats & Structure */}
        <div className="flex flex-col gap-4 overflow-y-auto pr-1">
          {activeTab === 'overview' && (
             <>
               <StatCard title="辖区派出所" value={data.overview.stations} unit="个" icon={<Shield size={20}/>} color="blue" />
               <div className="grid grid-cols-2 gap-4">
                  <StatCard title="民警总数" value={data.overview.police} unit="人" icon={<Users size={20}/>} color="indigo" />
                  <StatCard title="辅警总数" value={data.overview.auxiliary} unit="人" icon={<Users size={20}/>} color="cyan" />
               </div>
               
               <div className="glass-panel p-4 rounded-lg flex-1 min-h-[250px] flex flex-col">
                  <SectionTitle title="警辅比例分析" />
                  <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.overview.forceStructure}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                           {data.overview.forceStructure.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff' }} />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Community Police Ratio Bar */}
                  <div className="mt-2 border-t border-police-border/30 pt-3">
                     <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">社区民警 (占民警总数)</span>
                        <span className="text-police-primary font-bold">{((data.overview.communityPolice / data.overview.police) * 100).toFixed(1)}%</span>
                     </div>
                     <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-police-primary rounded-full"
                            style={{width: `${(data.overview.communityPolice / data.overview.police) * 100}%`}}
                        ></div>
                     </div>
                     <div className="mt-1 text-right text-xs text-gray-500">{data.overview.communityPolice} 人</div>
                  </div>
               </div>
             </>
          )}

          {activeTab === 'registered' && (
             <>
               <StatCard title="户籍人口总数" value={data.registered.total} unit="人" icon={<BadgeCheck size={20}/>} color="green" subText={`较上年末增长 ${data.registered.growthRate}%`} />
               <div className="glass-panel p-4 rounded-lg h-[250px] flex flex-col">
                  <SectionTitle title="性别分布" />
                   <div className="flex-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.registered.genderData}
                          cx="50%"
                          cy="50%"
                          innerRadius={0}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#3B82F6" /> {/* Male */}
                          <Cell fill="#EC4899" /> {/* Female */}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
               </div>
               <div className="glass-panel p-4 rounded-lg flex-1 flex flex-col min-h-[250px]">
                   <SectionTitle title="年龄段分布" />
                   <div className="flex-1">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data.registered.ageDist}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#1E3A8A" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={60} tick={{fill: '#9ca3af', fontSize: 11}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff' }} />
                          <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                     </ResponsiveContainer>
                   </div>
                </div>
             </>
          )}

          {activeTab === 'floating' && (
             <>
               <StatCard 
                 title="流动人口总数" 
                 value={data.floating.total} 
                 unit="人" 
                 icon={<Truck size={20}/>} 
                 color="orange" 
                 subText={<span className="text-yellow-400">其中人户分离: {data.floating.separation.toLocaleString()} 人</span>}
               />
               <div className="glass-panel p-4 rounded-lg flex-1 min-h-[250px] flex flex-col">
                  <SectionTitle title="流动人口来源 Top 5" />
                  <div className="flex-1">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={data.floating.sourceData} margin={{ left: 10 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={60} tick={{fill: '#9ca3af', fontSize: 11}} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff' }} />
                          <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={15} />
                        </BarChart>
                     </ResponsiveContainer>
                  </div>
               </div>
             </>
          )}
        </div>

        {/* Center Panel: Map (Span 2 columns) */}
        <div className="lg:col-span-2 glass-panel rounded-lg p-2 relative overflow-hidden flex flex-col border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.1)]">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
           <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
           <WeifangMap selected={selectedRegion} onSelect={setSelectedRegion} />
           
           {/* Bottom Overlay - Only Data Update Info */}
           <div className="absolute bottom-4 right-4 pointer-events-none">
              <div className="bg-black/40 backdrop-blur border border-police-border/50 rounded p-2 px-4 text-center">
                 <div className="text-gray-400 text-xs">数据更新时间</div>
                 <div className="text-blue-400 font-bold font-mono">2023-10-27 15:30:00</div>
              </div>
           </div>
        </div>

        {/* Right Panel: Trends & Analysis */}
        <div className="flex flex-col gap-4 overflow-y-auto pl-1">
           {activeTab === 'overview' && (
              <>
                 {/* Civil Police Analysis Combined */}
                 <div className="glass-panel p-3 rounded-lg flex flex-col h-[48%]">
                     <SectionTitle title="派出所民警" />
                     <div className="flex flex-col flex-1 gap-2">
                        {/* Gender - Top half */}
                        <div className="h-[40%] w-full flex flex-col">
                            <span className="text-xs text-gray-500 ml-2">性别分布</span>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.overview.policeGender}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={45}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.overview.policeGender.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff', fontSize: '12px' }} />
                                        <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="h-px bg-police-border/30 mx-2"></div>
                        <div className="flex-1 w-full flex flex-col">
                            <span className="text-xs text-gray-500 ml-2">年龄结构</span>
                            <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.overview.policeAge} layout="vertical" margin={{top:5, right:5, left:0, bottom:0}}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={55} tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff', fontSize: '12px' }} />
                                        <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={12}/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                     </div>
                 </div>

                 {/* Auxiliary Police Analysis Combined */}
                 <div className="glass-panel p-3 rounded-lg flex flex-col h-[48%]">
                     <SectionTitle title="派出所辅警" />
                     <div className="flex flex-col flex-1 gap-2">
                        <div className="h-[40%] w-full flex flex-col">
                             <span className="text-xs text-gray-500 ml-2">性别分布</span>
                             <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.overview.auxGender}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={45}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {data.overview.auxGender.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff', fontSize: '12px' }} />
                                        <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8} wrapperStyle={{fontSize: '10px'}}/>
                                    </PieChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                        <div className="h-px bg-police-border/30 mx-2"></div>
                        <div className="flex-1 w-full flex flex-col">
                            <span className="text-xs text-gray-500 ml-2">年龄结构</span>
                             <div className="flex-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.overview.auxAge} layout="vertical" margin={{top:5, right:5, left:0, bottom:0}}>
                                        <XAxis type="number" hide />
                                        <YAxis dataKey="name" type="category" width={55} tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff', fontSize: '12px' }} />
                                        <Bar dataKey="value" fill="#10B981" radius={[0, 4, 4, 0]} barSize={12}/>
                                    </BarChart>
                                </ResponsiveContainer>
                             </div>
                        </div>
                     </div>
                 </div>
              </>
           )}

           {activeTab === 'registered' && (
              <>
                <div className="glass-panel p-4 rounded-lg h-[250px] flex flex-col">
                   <SectionTitle title="近五年人口趋势 (万人)" />
                   <div className="flex-1">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.registered.trend}>
                          <defs>
                            <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E3A8A" />
                          <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                          <YAxis domain={['auto', 'auto']} tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff' }} />
                          <Area type="monotone" dataKey="value" stroke="#10B981" fillOpacity={1} fill="url(#colorTrend)" />
                        </AreaChart>
                     </ResponsiveContainer>
                   </div>
                </div>
                
                <div className="glass-panel p-4 rounded-lg flex-1 flex flex-col min-h-[250px]">
                   <SectionTitle title="人口四项变动业务数据" />
                   <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                       <div className="bg-blue-500/10 border border-blue-500/30 rounded p-3 flex flex-col items-center justify-center h-full">
                           <div className="text-blue-400 mb-1 flex items-center gap-1"><Baby size={16}/> 出生</div>
                           <div className="text-2xl font-bold text-white font-mono">{data.registered.fourChanges.birth}</div>
                       </div>
                       <div className="bg-red-500/10 border border-red-500/30 rounded p-3 flex flex-col items-center justify-center h-full">
                           <div className="text-red-400 mb-1 flex items-center gap-1"><UserMinus size={16}/> 死亡</div>
                           <div className="text-2xl font-bold text-white font-mono">{data.registered.fourChanges.death}</div>
                       </div>
                       <div className="bg-green-500/10 border border-green-500/30 rounded p-3 flex flex-col items-center justify-center h-full">
                           <div className="text-green-400 mb-1 flex items-center gap-1"><LogIn size={16}/> 迁入</div>
                           <div className="text-2xl font-bold text-white font-mono">{data.registered.fourChanges.moveIn}</div>
                       </div>
                       <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 flex flex-col items-center justify-center h-full">
                           <div className="text-yellow-400 mb-1 flex items-center gap-1"><LogOut size={16}/> 迁出</div>
                           <div className="text-2xl font-bold text-white font-mono">{data.registered.fourChanges.moveOut}</div>
                       </div>
                   </div>
                </div>
              </>
           )}

           {activeTab === 'floating' && (
              <>
                 <div className="grid grid-cols-2 gap-4">
                    <StatCard title="居住证办理总数" value={data.floating.permitCount} unit="本" icon={<BadgeCheck size={20}/>} color="green" />
                    <StatCard title="居住证办理率" value={data.floating.permitRate} unit="%" icon={<Activity size={20}/>} color="blue" />
                 </div>

                 <div className="glass-panel p-3 rounded-lg flex-1 flex flex-col">
                     <SectionTitle title="流动人口年龄分布" />
                     <div className="flex-1 h-32">
                       <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.floating.ageDist} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={60} tick={{fill: '#94a3b8', fontSize: 10}} axisLine={false} tickLine={false} />
                            <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff' }} />
                            <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={10}/>
                          </BarChart>
                       </ResponsiveContainer>
                     </div>
                 </div>

                 <div className="glass-panel p-3 rounded-lg h-40 flex flex-col">
                     <SectionTitle title="流动人口性别分布" />
                     <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data.floating.genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={50}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {data.floating.genderData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip contentStyle={{ backgroundColor: '#151E32', borderColor: '#1E3A8A', color: '#fff' }} />
                              <Legend verticalAlign="middle" align="right" layout="vertical" iconSize={8}/>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                 </div>
              </>
           )}
        </div>
      </div>
    </div>
  );
};