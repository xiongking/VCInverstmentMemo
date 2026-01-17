
import React, { useState } from 'react';
import { AnalysisReport, DeepDiveItem, TechTrendItem } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { 
  TrendingUp, ShieldAlert, DollarSign, Target, Activity, 
  CheckCircle2, XCircle, AlertCircle, Briefcase, 
  MoveUpRight, Zap, SearchCheck, Info, Layers, 
  Download, RotateCcw, X, ChevronRight, CircuitBoard, Lightbulb,
  ArrowRight, Scale, Rocket, AlertTriangle, ListChecks, Link, Globe, Crosshair
} from 'lucide-react';

interface DashboardProps {
  data: AnalysisReport;
  onReset: () => void;
}

// --- Apple-style Components ---

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-6 flex items-center gap-3">
    {children}
  </h2>
);

const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({ children, className = '', noPadding = false }) => {
  const hasBg = className.includes('bg-');
  // Default to white background, consistent rounded corners and subtle shadow
  const baseClass = `rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 overflow-hidden ${noPadding ? '' : 'p-8'}`;
  
  return (
    <div className={`${baseClass} ${hasBg ? '' : 'bg-white'} ${className}`}>
      {children}
    </div>
  );
};

const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`text-[11px] font-semibold text-[#86868b] uppercase tracking-wider block mb-2 ${className}`}>
    {children}
  </span>
);

const Value: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight ${className}`}>
    {children}
  </span>
);

const Badge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-3 py-1 rounded-full bg-[#F5F5F7] text-[#1d1d1f] text-xs font-medium border border-[#E5E5EA] ${className}`}>
    {children}
  </span>
);

const DeepDiveItemRow: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  item: DeepDiveItem;
  onOpenModal: (title: string, content: string) => void; 
}> = ({ icon, title, item, onOpenModal }) => (
  <div className="flex flex-col h-full justify-between group cursor-pointer p-6 hover:bg-[#F5F5F7]/50 transition-colors rounded-[20px]" onClick={() => onOpenModal(title, item.detailedContent)}>
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[#0071e3]">{icon}</div>
        <h4 className="text-base font-semibold text-[#1d1d1f]">{title}</h4>
      </div>
      <ul className="space-y-3 mb-6">
        {item.summaryPoints.slice(0, 3).map((point, idx) => (
          <li key={idx} className="flex items-start gap-3">
             <div className="h-1.5 w-1.5 rounded-full bg-[#86868b] mt-2 flex-shrink-0" />
             <span className="text-[13px] text-[#424245] leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="flex items-center text-[#0071e3] text-sm font-medium mt-2 group-hover:translate-x-1 transition-transform">
      {item.buttonLabel} <ChevronRight className="h-4 w-4 ml-1" />
    </div>
  </div>
);

// --- Main Dashboard ---

export const AnalysisDashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{title: string, content: string} | null>(null);

  const handleOpenModal = (title: string, content: string) => {
    setModalContent({ title, content });
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalContent(null), 300);
    document.body.style.overflow = 'unset';
  };

  const handleDownloadMarkdown = () => {
     const { companyAnalysis } = data;
     const now = new Date();
     const formattedTime = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
     const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/markdown;charset=utf-8' }); 
     const url = URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = `${companyAnalysis.name}_Report_${formattedTime}.json`;
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  // Updated to strictly return colors for text/icons, not backgrounds
  const getVerdictConfig = (v: string) => {
    switch (v) {
      case 'Invest': return { color: 'text-[#30d158]', label: 'Strong Buy', icon: CheckCircle2 };
      case 'Watch': return { color: 'text-[#ff9f0a]', label: 'Watchlist', icon: AlertCircle };
      case 'Pass': return { color: 'text-[#ff453a]', label: 'Pass', icon: XCircle };
      default: return { color: 'text-[#86868b]', label: v, icon: Info };
    }
  };

  const verdictConfig = getVerdictConfig(data.executiveSummary.preliminaryVerdict);
  const VerdictIcon = verdictConfig.icon;

  return (
    <div className="min-h-screen bg-[#F5F5F7] pb-32">
      
      {/* Modal - iOS Sheet Style */}
      {modalOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-[#323232]/60 backdrop-blur-md transition-opacity" onClick={handleCloseModal} />
          <div className="relative bg-white w-full max-w-3xl max-h-[90vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#F5F5F7] bg-white sticky top-0 z-10">
              <h3 className="text-xl font-semibold text-[#1d1d1f]">{modalContent.title}</h3>
              <button onClick={handleCloseModal} className="p-2 bg-[#F5F5F7] rounded-full hover:bg-[#E5E5EA] transition-colors">
                <X className="h-5 w-5 text-[#86868b]" />
              </button>
            </div>
            <div className="p-10 overflow-y-auto leading-loose text-[16px] text-[#1d1d1f] whitespace-pre-wrap font-normal">
              {modalContent.content}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <nav className="sticky top-0 z-40 w-full bg-[#F5F5F7]/80 backdrop-blur-xl border-b border-[#E5E5EA]/60 transition-all">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-black rounded-lg flex items-center justify-center text-white">
                <Briefcase className="h-4 w-4" />
             </div>
             <span className="text-sm font-semibold text-[#1d1d1f]">Investment Memo</span>
          </div>
          <div className="flex gap-3">
             <button onClick={handleDownloadMarkdown} className="p-2 text-[#1d1d1f] hover:bg-white rounded-full transition-colors">
               <Download className="h-5 w-5" />
             </button>
             <button onClick={onReset} className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0071e3] rounded-full hover:bg-[#0077ED] transition-colors">
               新分析
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 pt-10 space-y-12">
        
        {/* 1. The Verdict (Hero) - NOW TWO SEPARATE ROWS */}
        <section className="space-y-6">
            {/* Row 1: Investment Verdict */}
            <div className="bg-white rounded-[32px] p-10 flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50">
               <div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-6 bg-[#F5F5F7] ${verdictConfig.color}`}>
                    <VerdictIcon className="h-3.5 w-3.5" />
                    {verdictConfig.label}
                  </div>
                  <h1 className={`text-5xl font-semibold tracking-tight mb-6 ${verdictConfig.color}`}>
                    {data.executiveSummary.preliminaryVerdict === 'Invest' ? '建议投资' : data.executiveSummary.preliminaryVerdict === 'Watch' ? '保持关注' : '建议放弃'}
                  </h1>
               </div>
               <p className="text-lg text-[#1d1d1f] leading-relaxed font-normal">
                 {data.executiveSummary.verdictReason}
               </p>
            </div>

            {/* Row 2: Investment Thesis */}
            <div className="bg-white rounded-[32px] p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-white/50 flex flex-col justify-center">
               <Label>核心投资论点</Label>
               <p className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] leading-tight mb-8">
                 "{data.finalRecommendation.investmentThesis}"
               </p>
               <div className="flex flex-wrap gap-2">
                  {data.executiveSummary.coreViewpoints.map((pt, i) => (
                    <span key={i} className="px-4 py-2 bg-[#F5F5F7] text-[#1d1d1f] rounded-lg text-sm font-medium border border-[#E5E5EA]">
                      {pt}
                    </span>
                  ))}
               </div>
            </div>
        </section>

        {/* 2. Key Metrics & Company */}
        <section>
          <SectionTitle>公司概况与财务</SectionTitle>
          <div className="grid md:grid-cols-4 gap-6">
             {/* Valuation - NOW WHITE */}
             <Card className="md:col-span-2">
                <Label>公司估值</Label>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-semibold text-[#1d1d1f] tracking-tight">{data.financialAnalysis.companyValuation || "N/A"}</span>
                </div>
                <p className="text-sm text-[#86868b] leading-relaxed">{data.financialAnalysis.valuationAssessment}</p>
             </Card>
             
             {data.financialAnalysis.keyMetrics.slice(0, 2).map((m, i) => (
               <Card key={i} className="flex flex-col justify-center">
                 <Label>{m.label}</Label>
                 <Value>{m.value}</Value>
               </Card>
             ))}
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-6">
             <Card className="md:col-span-2">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="text-lg font-semibold text-[#1d1d1f]">营收增长预测</h3>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.financialAnalysis.revenueChartData} barGap={12}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5EA" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#86868b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: '12px'}} 
                        cursor={{fill: '#F5F5F7'}} 
                      />
                      <Bar dataKey="revenue" name="营收" fill="#1d1d1f" radius={[6, 6, 6, 6]} barSize={32} />
                      <Bar dataKey="profit" name="利润" fill="#d1d1d6" radius={[6, 6, 6, 6]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
             </Card>

             <Card>
                <Label>团队评估</Label>
                <p className="text-[15px] leading-relaxed text-[#1d1d1f] mb-6 mt-2">
                   {data.companyAnalysis.teamAssessment}
                </p>
                <div className="space-y-4">
                   {data.companyAnalysis.teamMembers.slice(0,3).map((m, i) => (
                     <div key={i} className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-[#F5F5F7] flex items-center justify-center font-bold text-[#86868b]">
                          {m.name[0]}
                        </div>
                        <div>
                           <div className="text-sm font-semibold text-[#1d1d1f]">{m.name}</div>
                           <div className="text-xs text-[#86868b]">{m.role}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </Card>
          </div>
        </section>

        {/* 3. Deep Dive (Bento Grid) */}
        <section>
          <SectionTitle>深度业务解析</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
             <Card noPadding>
                <DeepDiveItemRow 
                   icon={<CircuitBoard className="h-6 w-6" />} 
                   title="核心技术方案" 
                   item={data.businessDeepDive.technicalSolution} 
                   onOpenModal={handleOpenModal} 
                />
             </Card>
             <Card noPadding>
                <DeepDiveItemRow 
                   icon={<Layers className="h-6 w-6" />} 
                   title="产品矩阵" 
                   item={data.businessDeepDive.productPortfolio} 
                   onOpenModal={handleOpenModal} 
                />
             </Card>
             <Card noPadding>
                <DeepDiveItemRow 
                   icon={<Briefcase className="h-6 w-6" />} 
                   title="商业落地" 
                   item={data.businessDeepDive.commercializationPath} 
                   onOpenModal={handleOpenModal} 
                />
             </Card>
             <Card noPadding>
                <DeepDiveItemRow 
                   icon={<Activity className="h-6 w-6" />} 
                   title="运营交付" 
                   item={data.businessDeepDive.operationalStrengths} 
                   onOpenModal={handleOpenModal} 
                />
             </Card>
          </div>
        </section>

        {/* 4. Market & Tech Trends */}
        <section>
          <SectionTitle>行业与技术趋势</SectionTitle>
          <div className="grid md:grid-cols-12 gap-6">
             {/* Left: Stats & Regulatory */}
             <div className="md:col-span-4 flex flex-col gap-6">
               <Card>
                  <Label>市场规模 (TAM)</Label>
                  <Value>{data.marketAnalysis.marketSize}</Value>
                  <div className="mt-6">
                     <Label>复合增长率 (CAGR)</Label>
                     <div className="flex items-center gap-2">
                        <Value className="text-[#30d158]">{data.marketAnalysis.cagr}</Value>
                        <TrendingUp className="h-5 w-5 text-[#30d158]" />
                     </div>
                  </div>
               </Card>
               <Card>
                  <div className="flex items-center gap-2 mb-4">
                     <Scale className="h-5 w-5 text-[#86868b]" />
                     <h3 className="font-semibold text-[#1d1d1f]">政策监管</h3>
                  </div>
                  <p className="text-sm text-[#1d1d1f] leading-relaxed">
                     {data.marketAnalysis.regulatoryEnvironment}
                  </p>
               </Card>
             </div>

             {/* Right: Market Dynamics */}
             <Card className="md:col-span-8">
               <div className="grid md:grid-cols-2 gap-8">
                  <div>
                     <div className="flex items-center gap-2 mb-4 text-[#0071e3]">
                        <Rocket className="h-5 w-5" />
                        <h3 className="font-semibold text-[#1d1d1f]">增长驱动力</h3>
                     </div>
                     <ul className="space-y-3">
                        {data.marketAnalysis.drivers.map((d, i) => (
                           <li key={i} className="flex items-start gap-2 text-[13px] text-[#424245] leading-relaxed">
                              <span className="text-[#0071e3] font-bold">•</span>
                              {d}
                           </li>
                        ))}
                     </ul>
                  </div>
                  <div>
                     <div className="flex items-center gap-2 mb-4 text-[#ff9f0a]">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="font-semibold text-[#1d1d1f]">市场痛点</h3>
                     </div>
                     <ul className="space-y-3">
                        {data.marketAnalysis.marketPainPoints.map((p, i) => (
                           <li key={i} className="flex items-start gap-2 text-[13px] text-[#424245] leading-relaxed">
                              <span className="text-[#ff9f0a] font-bold">•</span>
                              {p}
                           </li>
                        ))}
                     </ul>
                  </div>
               </div>
             </Card>

             {/* Bottom: Detailed Tech Trends */}
             <Card className="md:col-span-12">
                <div className="flex items-center gap-2 mb-6">
                   <Lightbulb className="h-5 w-5 text-[#0071e3]" fill="currentColor" />
                   <h3 className="font-semibold text-[#1d1d1f]">深度技术趋势洞察</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {data.marketAnalysis.techTrends.map((t, i) => (
                      <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl hover:bg-[#F5F5F7] transition-colors border border-transparent hover:border-[#E5E5EA]">
                         <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-[#1d1d1f] text-base">{t.name}</h4>
                            <Badge className={
                               t.maturity === 'Mature' ? 'bg-green-100 text-green-700 border-green-200' :
                               t.maturity === 'Growth' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                               'bg-purple-100 text-purple-700 border-purple-200'
                            }>
                               {t.maturity === 'Mature' ? '成熟期' : t.maturity === 'Growth' ? '成长期' : '萌芽期'}
                            </Badge>
                         </div>
                         <p className="text-[13px] leading-relaxed text-[#86868b]">
                            {t.description}
                         </p>
                      </div>
                   ))}
                </div>
             </Card>
          </div>
        </section>

        {/* 5. NEW: Competitive Landscape - Radar Chart */}
        <section>
          <SectionTitle>竞争格局与护城河</SectionTitle>
          <div className="grid md:grid-cols-2 gap-6">
             {/* Left: Radar Chart */}
             <Card className="flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                   <Target className="h-5 w-5 text-[#0071e3]" />
                   <h3 className="font-semibold text-[#1d1d1f]">核心竞争力雷达图</h3>
                </div>
                <p className="text-xs text-[#86868b] mb-4">Target Company (Blue) vs Market Average (Grey)</p>
                <div className="h-[300px] w-full -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data.competitiveLandscape.competitorComparison || []}>
                      <PolarGrid stroke="#E5E5EA" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fill: '#86868b', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                      <Radar name="本公司" dataKey="companyScore" stroke="#0071e3" fill="#0071e3" fillOpacity={0.4} />
                      <Radar name="行业平均" dataKey="competitorScore" stroke="#86868b" fill="#86868b" fillOpacity={0.1} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: '12px'}} 
                        itemStyle={{color: '#1d1d1f'}}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}/>
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
             </Card>

             {/* Right: Competitors & Moat */}
             <div className="flex flex-col gap-6">
                <Card>
                   <Label>主要竞争对手</Label>
                   <div className="flex flex-wrap gap-2 mb-6">
                      {data.competitiveLandscape.competitors.map((c, i) => (
                         <span key={i} className="px-3 py-1.5 bg-[#F5F5F7] text-[#1d1d1f] text-sm font-medium rounded-lg border border-[#E5E5EA]">
                            {c}
                         </span>
                      ))}
                   </div>
                   <Label>护城河 (Moat)</Label>
                   <p className="text-sm text-[#1d1d1f] leading-relaxed">
                      {data.competitiveLandscape.moat}
                   </p>
                </Card>
                <Card>
                   <Label>波特五力简析</Label>
                   <div className="space-y-3 mt-3">
                      {data.competitiveLandscape.portersFiveForces.slice(0,3).map((force, i) => (
                         <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-[#424245]">{force.aspect}</span>
                            <Badge className={
                               force.strength === 'High' ? 'bg-red-50 text-red-600' : 
                               force.strength === 'Low' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                            }>{force.strength}</Badge>
                         </div>
                      ))}
                   </div>
                </Card>
             </div>
          </div>
        </section>

        {/* 6. Risk Assessment - Full Width & Optimized Typography */}
        <section>
          <Card>
            <div className="flex items-center gap-3 mb-8">
               <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center text-[#ff453a]">
                  <ShieldAlert className="h-5 w-5" />
               </div>
               <h3 className="text-xl font-semibold text-[#1d1d1f]">全面风险评估</h3>
            </div>
            
            <div className="grid gap-8">
               {data.riskAssessment.risks.map((r, i) => (
                  <div key={i} className="group relative">
                     {/* Decorative line */}
                     <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#F5F5F7] rounded-full group-hover:bg-red-500/20 transition-colors"></div>
                     
                     <div className="pl-6 space-y-4">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-xs font-bold text-[#86868b] uppercase tracking-wider border border-[#E5E5EA] px-2 py-0.5 rounded-md">
                               {r.category}
                            </span>
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                               r.severity === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                               r.severity === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                            }`}>
                               {r.severity} Severity
                            </span>
                        </div>

                        <h4 className="text-lg md:text-xl font-medium text-[#1d1d1f] leading-snug">
                           {r.risk}
                        </h4>

                        <div className="grid md:grid-cols-2 gap-4">
                           <div className="bg-[#F5F5F7]/60 p-5 rounded-2xl border border-[#F5F5F7] hover:border-red-100 transition-colors">
                              <span className="text-[11px] font-bold text-[#ff453a] uppercase tracking-wide mb-2 block flex items-center gap-1.5">
                                 <AlertTriangle className="h-3.5 w-3.5" /> 潜在影响
                              </span>
                              <p className="text-[14px] text-[#1d1d1f]/80 leading-relaxed">
                                 {r.impact}
                              </p>
                           </div>
                           <div className="bg-[#F5F5F7]/60 p-5 rounded-2xl border border-[#F5F5F7] hover:border-green-100 transition-colors">
                              <span className="text-[11px] font-bold text-[#30d158] uppercase tracking-wide mb-2 block flex items-center gap-1.5">
                                 <CheckCircle2 className="h-3.5 w-3.5" /> 应对策略
                              </span>
                              <p className="text-[14px] text-[#1d1d1f]/80 leading-relaxed">
                                 {r.mitigation}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
          </Card>
        </section>

        {/* 7. Exit Strategy - Horizontal Full Width */}
        <section>
             <Card>
                <div className="flex items-center gap-3 mb-8">
                   <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0071e3]">
                      <MoveUpRight className="h-5 w-5" />
                   </div>
                   <h3 className="text-xl font-semibold text-[#1d1d1f]">退出预期</h3>
                </div>
                
                <div className="grid md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E5E5EA]">
                   <div className="space-y-2 px-4 first:pl-0">
                      <Label>首选退出路径</Label>
                      <div className="text-xl font-medium text-[#1d1d1f] leading-snug">
                         {data.exitStrategy.paths.join(" / ")}
                      </div>
                   </div>
                   <div className="space-y-2 pt-6 md:pt-0 px-4">
                      <Label>预计周期</Label>
                      <div className="text-3xl font-semibold text-[#1d1d1f]">
                         {data.exitStrategy.timeframe}
                      </div>
                      <p className="text-xs text-[#86868b]">{data.exitStrategy.timeframeRationale}</p>
                   </div>
                   <div className="space-y-2 pt-6 md:pt-0 px-4">
                      <Label>潜在回报倍数 (MOIC)</Label>
                      <div className="text-3xl font-semibold text-[#30d158]">
                         {data.exitStrategy.returnsPotential}
                      </div>
                      <p className="text-xs text-[#86868b]">{data.exitStrategy.returnsRationale}</p>
                   </div>
                </div>
             </Card>
        </section>

        {/* 8. Due Diligence Focus */}
        <section>
          <SectionTitle>后续尽调关注重点</SectionTitle>
          <Card>
             <div className="grid gap-3">
                {[...data.finalRecommendation.dueDiligenceFocus]
                  .sort((a, b) => {
                     const pMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
                     return (pMap[b.priority] || 0) - (pMap[a.priority] || 0);
                  })
                  .map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row md:items-start justify-between gap-4 p-5 rounded-2xl bg-[#F5F5F7]/50 hover:bg-[#F5F5F7] transition-colors border border-[#E5E5EA]">
                       <div className="flex gap-4 flex-1">
                          <div className="mt-0.5">
                             <ListChecks className="h-5 w-5 text-[#0071e3]" />
                          </div>
                          <div className="flex-1">
                             <h4 className="text-[#1d1d1f] font-medium text-[15px] leading-relaxed">{item.question}</h4>
                             <p className="text-sm text-[#86868b] mt-2 leading-relaxed">{item.reasoning}</p>
                          </div>
                       </div>
                       <div className="flex-shrink-0 pl-9 md:pl-0 pt-0.5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                             item.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' :
                             item.priority === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                             'bg-gray-100 text-gray-600 border-gray-200'
                          }`}>
                             {item.priority === 'High' ? 'P0 高优' : item.priority === 'Medium' ? 'P1 中优' : 'P2 低优'}
                          </span>
                       </div>
                    </div>
                  ))}
             </div>
          </Card>
        </section>

        {/* 9. Search Sources References - New Section */}
        {data.searchSources && data.searchSources.length > 0 && (
          <section>
            <SectionTitle>外部参考来源</SectionTitle>
            <Card>
              <div className="grid gap-0 divide-y divide-[#E5E5EA]">
                {data.searchSources.map((source, idx) => (
                  <a 
                    key={idx} 
                    href={source.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 hover:bg-[#F5F5F7] transition-colors group text-decoration-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#F5F5F7] flex items-center justify-center text-[#86868b] group-hover:bg-white group-hover:shadow-sm transition-all">
                       <Globe className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-[#1d1d1f] truncate pr-4 group-hover:text-[#0071e3] transition-colors">
                        {source.title}
                      </div>
                      <div className="text-xs text-[#86868b] truncate">
                        {source.url}
                      </div>
                    </div>
                    <Link className="h-4 w-4 text-[#d1d1d6] group-hover:text-[#0071e3]" />
                  </a>
                ))}
              </div>
            </Card>
          </section>
        )}

      </main>
    </div>
  );
};
