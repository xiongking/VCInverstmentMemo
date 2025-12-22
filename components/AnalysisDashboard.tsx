import React from 'react';
import { AnalysisReport, PortersForce, RiskItem } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend
} from 'recharts';
import { 
  TrendingUp, ShieldAlert, DollarSign, Target, Activity, 
  CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, Briefcase, Printer, 
  Users, MoveUpRight, Zap
} from 'lucide-react';

interface DashboardProps {
  data: AnalysisReport;
  onReset: () => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden break-inside-avoid ${className}`}>
    <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
      <div className="text-blue-600">{icon}</div>
      <h3 className="font-semibold text-slate-800 text-lg">{title}</h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'yellow' | 'slate' | 'purple' }> = ({ children, color = 'blue' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-rose-100 text-rose-700',
    yellow: 'bg-amber-100 text-amber-700',
    slate: 'bg-slate-100 text-slate-700',
    purple: 'bg-purple-100 text-purple-700',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border border-transparent ${colors[color]}`}>
      {children}
    </span>
  );
};

export const AnalysisDashboard: React.FC<DashboardProps> = ({ data, onReset }) => {
  
  const getVerdictText = (v: string) => {
    switch (v) {
      case 'Invest': return '建议投资';
      case 'Watch': return '保持关注';
      case 'Pass': return '建议放弃';
      default: return v;
    }
  };

  const getVerdictColor = (v: string) => {
    switch (v) {
      case 'Invest': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Watch': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Pass': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const getStrengthText = (s: string) => {
     switch(s) {
       case 'High': return '高';
       case 'Medium': return '中';
       case 'Low': return '低';
       default: return s;
     }
  };

  // Process data for Radar Chart
  const portersData = data.competitiveLandscape.portersFiveForces.map(item => ({
    subject: item.aspect,
    A: item.strength === 'High' ? 3 : item.strength === 'Medium' ? 2 : 1,
    fullMark: 3,
  }));

  return (
    <div className="min-h-screen bg-slate-50 pb-20 print:bg-white print:pb-0">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Briefcase className="h-6 w-6 text-blue-700" />
               <h1 className="text-xl font-bold text-slate-900">投资备忘录</h1>
            </div>
            <div className="flex gap-4">
               <button onClick={onReset} className="text-sm font-medium text-slate-500 hover:text-slate-800">
                 新分析
               </button>
            </div>
            
            <div className={`px-4 py-1.5 rounded-full border font-bold text-sm flex items-center gap-2 ${getVerdictColor(data.executiveSummary.preliminaryVerdict)}`}>
               {data.executiveSummary.preliminaryVerdict === 'Invest' && <CheckCircle2 className="h-4 w-4" />}
               {data.executiveSummary.preliminaryVerdict === 'Watch' && <AlertCircle className="h-4 w-4" />}
               {data.executiveSummary.preliminaryVerdict === 'Pass' && <XCircle className="h-4 w-4" />}
               {getVerdictText(data.executiveSummary.preliminaryVerdict)}
            </div>
          </div>
        </div>
      </header>

      <main id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:py-0 print:px-0">
        
        {/* Executive Summary Hero */}
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative overflow-hidden break-inside-avoid">
          {/* Use data-html2canvas-ignore to ensure gradients/decorations don't cause issues if they render poorly, but usually linear gradients are fine */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">投资论点 (Investment Thesis)</h2>
            <p className="text-lg text-slate-700 leading-relaxed italic border-l-4 border-blue-500 pl-4 mb-6">
              "{data.finalRecommendation.investmentThesis}"
            </p>
            
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">核心观点</h4>
                <ul className="space-y-2">
                  {data.executiveSummary.coreViewpoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <span className="text-blue-500 mt-1 min-w-[4px]">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">决策依据</h4>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {data.executiveSummary.verdictReason}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Market */}
          <SectionCard title="市场机会" icon={<TrendingUp className="h-5 w-5" />}>
            <div className="flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-slate-500">市场规模 (TAM)</p>
                <p className="text-2xl font-bold text-slate-900">{data.marketAnalysis.marketSize}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">CAGR</p>
                <p className="text-2xl font-bold text-emerald-600">{data.marketAnalysis.cagr}</p>
              </div>
            </div>
            <div className="h-64 w-full mb-6">
               <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.marketAnalysis.growthChartData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mb-4">
              <h5 className="font-medium text-slate-900 mb-2 text-sm flex items-center gap-1">
                <Zap className="h-3 w-3 text-blue-500"/> 增长驱动力
              </h5>
              <div className="flex flex-wrap gap-2">
                {data.marketAnalysis.drivers.map((d, i) => (
                  <Badge key={i} color="blue">{d}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-slate-900 mb-2 text-sm flex items-center gap-1">
                <Users className="h-3 w-3 text-purple-500"/> 目标客户 (Target Audience)
              </h5>
              <div className="flex flex-wrap gap-2">
                {data.marketAnalysis.customerSegments && data.marketAnalysis.customerSegments.map((d, i) => (
                  <Badge key={i} color="purple">{d}</Badge>
                ))}
              </div>
            </div>
          </SectionCard>

          {/* Financials */}
          <SectionCard title="财务轨迹" icon={<DollarSign className="h-5 w-5" />}>
             <div className="grid grid-cols-2 gap-4 mb-6">
                {data.financialAnalysis.keyMetrics.slice(0, 4).map((m, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg border border-transparent">
                    <p className="text-xs text-slate-500 uppercase">{m.label}</p>
                    <p className="font-semibold text-slate-800">{m.value}</p>
                  </div>
                ))}
             </div>
             <div className="h-64 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.financialAnalysis.revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                  <Bar dataKey="revenue" name="营收 (Revenue)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="利润 (Profit)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             </div>
             <p className="text-xs text-slate-400 text-center">
               *历史与预测数据 (基于文档内容的估算)
             </p>
          </SectionCard>

          {/* SWOT Analysis */}
          <div className="col-span-1 lg:col-span-2 break-inside-avoid">
             <SectionCard title="SWOT 分析" icon={<MoveUpRight className="h-5 w-5" />}>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
                      <h4 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
                         <span className="bg-emerald-200 text-emerald-800 rounded px-1.5 text-sm">S</span> 优势 (Strengths)
                      </h4>
                      <ul className="space-y-1">
                         {data.swotAnalysis?.strengths.map((s, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                               <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0"></div>
                               {s}
                            </li>
                         ))}
                      </ul>
                   </div>

                   <div className="bg-amber-50 rounded-lg p-5 border border-amber-100">
                      <h4 className="text-amber-800 font-bold mb-3 flex items-center gap-2">
                         <span className="bg-amber-200 text-amber-800 rounded px-1.5 text-sm">W</span> 劣势 (Weaknesses)
                      </h4>
                      <ul className="space-y-1">
                         {data.swotAnalysis?.weaknesses.map((s, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                               <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 flex-shrink-0"></div>
                               {s}
                            </li>
                         ))}
                      </ul>
                   </div>

                   <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                      <h4 className="text-blue-800 font-bold mb-3 flex items-center gap-2">
                         <span className="bg-blue-200 text-blue-800 rounded px-1.5 text-sm">O</span> 机会 (Opportunities)
                      </h4>
                      <ul className="space-y-1">
                         {data.swotAnalysis?.opportunities.map((s, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                               <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                               {s}
                            </li>
                         ))}
                      </ul>
                   </div>

                   <div className="bg-rose-50 rounded-lg p-5 border border-rose-100">
                      <h4 className="text-rose-800 font-bold mb-3 flex items-center gap-2">
                         <span className="bg-rose-200 text-rose-800 rounded px-1.5 text-sm">T</span> 威胁 (Threats)
                      </h4>
                      <ul className="space-y-1">
                         {data.swotAnalysis?.threats.map((s, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                               <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 flex-shrink-0"></div>
                               {s}
                            </li>
                         ))}
                      </ul>
                   </div>
                </div>
             </SectionCard>
          </div>

          {/* Competition */}
          <SectionCard title="竞争格局" icon={<Target className="h-5 w-5" />}>
             <div className="mb-6">
               <h4 className="text-sm font-semibold text-slate-700 mb-2">护城河评估</h4>
               <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                 {data.competitiveLandscape.moat}
               </p>
             </div>
             
             <h4 className="text-sm font-semibold text-slate-700 mb-3">波特五力模型 (Porter's Five Forces)</h4>
             
             {/* Radar Chart for Porter's Forces */}
             <div className="h-64 w-full mb-6 flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={portersData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
                    <Radar
                      name="Competitive Intensity"
                      dataKey="A"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>

             <div className="space-y-3">
               {data.competitiveLandscape.portersFiveForces.map((f, i) => (
                 <div key={i} className="flex items-center justify-between text-sm border-b border-slate-50 pb-2 last:border-0">
                   <span className="text-slate-600 font-medium">{f.aspect}</span>
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-400 hidden sm:block truncate max-w-[150px]">{f.comment}</span>
                     <Badge color={f.strength === 'High' ? 'red' : f.strength === 'Medium' ? 'yellow' : 'green'}>
                       {getStrengthText(f.strength)}
                     </Badge>
                   </div>
                 </div>
               ))}
             </div>
          </SectionCard>

          {/* Risks */}
          <SectionCard title="风险评估" icon={<ShieldAlert className="h-5 w-5" />}>
            <div className="space-y-4">
              {data.riskAssessment.risks.map((risk, i) => (
                <div key={i} className="bg-slate-50 p-4 rounded-lg border-l-4 border-slate-200 hover:border-blue-400 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-slate-700 text-sm">{risk.category}</span>
                    <Badge color={risk.severity === 'High' ? 'red' : risk.severity === 'Medium' ? 'yellow' : 'blue'}>
                      {getStrengthText(risk.severity)} 风险
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-800 font-medium mb-2">{risk.risk}</p>
                  <div className="flex items-start gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-400 uppercase">应对措施:</span>
                    {risk.mitigation}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

        </div>

        {/* Full Company Analysis & Team */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 break-inside-avoid">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-800">公司与团队深度分析</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <h4 className="font-semibold text-slate-900 mb-2">商业模式</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{data.companyAnalysis.businessModel}</p>
            </div>
            <div className="col-span-1">
              <h4 className="font-semibold text-slate-900 mb-2">产品优势</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{data.companyAnalysis.productHighlight}</p>
            </div>
            <div className="col-span-1">
              <h4 className="font-semibold text-slate-900 mb-2">团队能力</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{data.companyAnalysis.teamAssessment}</p>
            </div>
          </div>
        </section>

        {/* Q&A Section */}
        <section className="bg-slate-800 text-slate-100 rounded-xl shadow-lg p-8 break-inside-avoid">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <AlertCircle className="text-yellow-400 h-5 w-5" />
            针对创始人的核心问题
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
             {data.finalRecommendation.keyQuestions.map((q, i) => (
               <div key={i} className="flex gap-4">
                 <span className="text-slate-500 font-mono font-bold text-lg">{(i + 1).toString().padStart(2, '0')}</span>
                 <p className="text-slate-300">{q}</p>
               </div>
             ))}
          </div>
        </section>

        {/* Exit Strategy Footer */}
        <div className="grid md:grid-cols-3 gap-4 text-center break-inside-avoid">
           <div className="bg-white p-6 rounded-lg border border-slate-200">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">退出策略</p>
             <p className="font-semibold text-slate-800">{data.exitStrategy.paths.join(', ')}</p>
           </div>
           <div className="bg-white p-6 rounded-lg border border-slate-200">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">预计时间周期</p>
             <p className="font-semibold text-slate-800">{data.exitStrategy.timeframe}</p>
           </div>
           <div className="bg-white p-6 rounded-lg border border-slate-200">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">潜在回报 (ROI)</p>
             <p className="font-semibold text-blue-600">{data.exitStrategy.returnsPotential}</p>
           </div>
        </div>

      </main>
    </div>
  );
};