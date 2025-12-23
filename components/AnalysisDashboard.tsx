
import React from 'react';
import { AnalysisReport } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, ShieldAlert, DollarSign, Target, Activity, 
  CheckCircle2, XCircle, AlertCircle, Briefcase, 
  Users, MoveUpRight, Zap, FileText, Scale, Lightbulb, SearchCheck, Sparkles, Info, User,
  Gavel, AlertTriangle, Cpu, Layers, ShoppingBag, Truck
} from 'lucide-react';

interface DashboardProps {
  data: AnalysisReport;
  onReset: () => void;
}

const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
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

  const getPriorityScore = (p: string) => {
    switch(p) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };

  const generateMarkdown = (report: AnalysisReport) => {
    const today = new Date().toLocaleDateString('zh-CN');
    
    // Sort DD items
    const sortedDD = [...report.finalRecommendation.dueDiligenceFocus].sort(
      (a, b) => getPriorityScore(b.priority) - getPriorityScore(a.priority)
    );

    return `
# 投资备忘录

**目标公司**: ${report.companyAnalysis.name}
**生成日期**: ${today}
**初判结果**: ${getVerdictText(report.executiveSummary.preliminaryVerdict)}
**决策依据**: ${report.executiveSummary.verdictReason}

---

## 1. 投资论点
> "${report.finalRecommendation.investmentThesis}"

### 核心观点
${report.executiveSummary.coreViewpoints.map(v => `- ${v}`).join('\n')}

---

## 2. 公司与团队
- **公司名称**: ${report.companyAnalysis.name}
- **团队评估**: ${report.companyAnalysis.teamAssessment}

### 核心团队成员
${report.companyAnalysis.teamMembers?.map(m => `
**${m.name}** (${m.role})
${m.background}
`).join('\n') || '未提取到具体成员信息'}

---

## 3. 投资亮点
${report.investmentHighlights?.map(h => `- ${h.highlight} (${h.rating === 'High' ? '高' : '中'})`).join('\n') || '暂无亮点提取'}

---

## 4. 深度业务与技术解析

### 核心技术方案 (Technology)
${report.businessDeepDive.technicalSolution}

### 产品矩阵 (Products)
${report.businessDeepDive.productPortfolio}

### 商业落地与模式 (Commercialization)
${report.businessDeepDive.commercializationPath}

### 运营与交付能力 (Operations)
${report.businessDeepDive.operationalStrengths}

---

## 5. 行业及市场分析
**市场综述**: ${report.marketAnalysis.summary}

- **市场规模 (TAM)**: ${report.marketAnalysis.marketSize}
- **CAGR**: ${report.marketAnalysis.cagr}

### 政策监管环境
${report.marketAnalysis.regulatoryEnvironment || '未提供详细分析'}

### 市场主要痛点
${report.marketAnalysis.marketPainPoints?.map(p => `- ${p}`).join('\n') || '未提供'}

### 增长驱动力
${report.marketAnalysis.drivers.map(d => `- ${d}`).join('\n')}

### 目标客户
${report.marketAnalysis.customerSegments.map(c => `- ${c}`).join('\n')}

---

## 6. 财务与估值

### 关键指标
${report.financialAnalysis.keyMetrics.map(m => `- **${m.label}**: ${m.value}`).join('\n')}

### 估值分析
**目标公司估值**: ${report.financialAnalysis.companyValuation || '未披露/未估算'}

### 同行业上市公司对标
| 公司名称 | 代码 | 市值/估值 | 倍数 |
| :--- | :--- | :--- | :--- |
${report.financialAnalysis.comparables?.map(c => `| ${c.name} | ${c.code} | ${c.valuation} | ${c.multiples} |`).join('\n') || '| 暂无详细对标数据 | | | |'}

### 财务综述
${report.financialAnalysis.summary}

---

## 7. 竞争格局
**护城河**: ${report.competitiveLandscape.moat}
**竞争综述**: ${report.competitiveLandscape.summary}

### 波特五力分析
${report.competitiveLandscape.portersFiveForces.map(f => `- **${f.aspect}** (${getStrengthText(f.strength)}): ${f.comment}`).join('\n')}

---

## 8. SWOT 分析
**优势**
${report.swotAnalysis.strengths.map(s => `- ${s}`).join('\n')}

**劣势**
${report.swotAnalysis.weaknesses.map(w => `- ${w}`).join('\n')}

**机会**
${report.swotAnalysis.opportunities.map(o => `- ${o}`).join('\n')}

**威胁**
${report.swotAnalysis.threats.map(t => `- ${t}`).join('\n')}

---

## 9. 投资风险
${report.riskAssessment.risks.map(r => `- **${r.category}** (${getStrengthText(r.severity)}): ${r.risk}\n  - *应对*: ${r.mitigation}`).join('\n')}

---

## 10. 退出策略
- **路径**: ${report.exitStrategy.paths.join(', ')}
- **周期**: ${report.exitStrategy.timeframe}
- **周期依据**: ${report.exitStrategy.timeframeRationale || '未提供'}
- **回报潜力**: ${report.exitStrategy.returnsPotential}
- **回报依据**: ${report.exitStrategy.returnsRationale || '未提供'}

---

## 11. 后续尽调关注要点
${sortedDD.map((q, i) => `${i + 1}. [${q.priority}] ${q.question}`).join('\n')}

---
*Generated by 商业计划书解读 AI*
    `.trim();
  };

  const handleDownloadMarkdown = () => {
    const markdownContent = generateMarkdown(data);
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Construct Filename: [CompanyName]_备忘录_[YYYYMMDD_HHmmss]_[RandomID].md
    const companyName = data.companyAnalysis.name ? data.companyAnalysis.name.replace(/[\/\\?%*:|"<>]/g, '') : '目标公司';
    const now = new Date();
    const timestamp = 
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') + '_' +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase();

    link.download = `${companyName}_备忘录_${timestamp}_${randomId}.md`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Process data for Radar Chart
  const portersData = data.competitiveLandscape.portersFiveForces.map(item => ({
    subject: item.aspect,
    A: item.strength === 'High' ? 3 : item.strength === 'Medium' ? 2 : 1,
    fullMark: 3,
  }));

  // Sort Due Diligence items
  const sortedDueDiligence = [...data.finalRecommendation.dueDiligenceFocus].sort(
    (a, b) => getPriorityScore(b.priority) - getPriorityScore(a.priority)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
               <Briefcase className="h-6 w-6 text-blue-700" />
               <h1 className="text-xl font-bold text-slate-900">投资备忘录</h1>
            </div>
            <div className="flex gap-4">
               <button 
                 onClick={handleDownloadMarkdown} 
                 className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
               >
                 <FileText className="h-4 w-4" />
                 下载 Markdown
               </button>
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

      <main id="report-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Executive Summary Hero */}
        <section className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-16 -mt-16 opacity-50"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">投资论点</h2>
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

        {/* Company & Team - UPDATED LAYOUT */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <Activity className="h-6 w-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-800">公司与团队核心评估</h3>
          </div>
          
          <div className="mb-8">
             <div className="p-5 rounded-xl border border-slate-100 bg-slate-50">
               <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" /> 团队综合评估
               </h4>
               <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.companyAnalysis.teamAssessment}</p>
             </div>
          </div>

          {/* New Full Width Section for Team Members */}
          {data.companyAnalysis.teamMembers && data.companyAnalysis.teamMembers.length > 0 && (
            <div className="">
               <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                 <User className="h-5 w-5 text-indigo-600" /> 核心团队成员
               </h4>
               <div className="grid gap-4">
                 {data.companyAnalysis.teamMembers.map((member, i) => (
                   <div key={i} className="flex flex-col md:flex-row gap-4 p-5 rounded-xl bg-indigo-50/50 border border-indigo-100">
                      <div className="md:w-1/4 flex-shrink-0">
                         <div className="font-bold text-lg text-slate-900">{member.name}</div>
                         <div className="text-sm font-medium text-indigo-600 mt-1">{member.role}</div>
                      </div>
                      <div className="md:w-3/4">
                         <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{member.background}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </section>

        {/* Detailed Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* NEW SECTION: Deep Dive Analysis */}
          <div className="col-span-1 lg:col-span-2">
             <SectionCard title="深度业务与技术解析" icon={<Layers className="h-5 w-5" />}>
                <div className="space-y-8">
                   
                   {/* Tech */}
                   <div className="grid md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                         <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Cpu className="h-5 w-5 text-violet-600" /> 核心技术方案
                         </h4>
                      </div>
                      <div className="md:col-span-3">
                         <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.businessDeepDive.technicalSolution}</p>
                      </div>
                   </div>

                   <hr className="border-slate-100" />

                   {/* Product */}
                   <div className="grid md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                         <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-rose-500" /> 产品矩阵
                         </h4>
                      </div>
                      <div className="md:col-span-3">
                         <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.businessDeepDive.productPortfolio}</p>
                      </div>
                   </div>

                   <hr className="border-slate-100" />

                   {/* Business Model */}
                   <div className="grid md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                         <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Briefcase className="h-5 w-5 text-amber-500" /> 商业落地与模式
                         </h4>
                      </div>
                      <div className="md:col-span-3">
                         <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.businessDeepDive.commercializationPath}</p>
                      </div>
                   </div>

                   <hr className="border-slate-100" />

                   {/* Operations */}
                   <div className="grid md:grid-cols-4 gap-6">
                      <div className="md:col-span-1">
                         <h4 className="font-bold text-slate-900 flex items-center gap-2">
                            <Truck className="h-5 w-5 text-emerald-600" /> 运营与交付能力
                         </h4>
                      </div>
                      <div className="md:col-span-3">
                         <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{data.businessDeepDive.operationalStrengths}</p>
                      </div>
                   </div>
                </div>
             </SectionCard>
          </div>

          {/* Industry & Market - UPDATED */}
          <div className="col-span-1 lg:col-span-2">
            <SectionCard title="行业及市场分析" icon={<TrendingUp className="h-5 w-5" />}>
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Charts and Metrics */}
                <div className="lg:col-span-1 space-y-6">
                   <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-slate-500">市场规模 (TAM)</p>
                      <p className="text-2xl font-bold text-slate-900">{data.marketAnalysis.marketSize}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">CAGR</p>
                      <p className="text-2xl font-bold text-emerald-600">{data.marketAnalysis.cagr}</p>
                    </div>
                  </div>
                  <div className="h-48 w-full">
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
                        <Tooltip contentStyle={{borderRadius: '8px', border: 'none'}} />
                        <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Right: Detailed Text Analysis */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500"/> 行业结构与趋势
                    </h5>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                      {data.marketAnalysis.summary}
                    </p>
                  </div>
                  
                  {/* New Sections: Regulatory & Pain Points */}
                  <div className="grid md:grid-cols-2 gap-4">
                     <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                           <Gavel className="h-4 w-4 text-slate-500"/> 政策监管环境
                        </h5>
                        <p className="text-sm text-slate-600 leading-relaxed">
                           {data.marketAnalysis.regulatoryEnvironment || "未提及"}
                        </p>
                     </div>
                     <div className="bg-rose-50 p-4 rounded-lg border border-rose-100">
                        <h5 className="font-bold text-slate-800 mb-2 flex items-center gap-2 text-sm">
                           <AlertTriangle className="h-4 w-4 text-rose-500"/> 市场主要痛点
                        </h5>
                        <ul className="text-sm text-slate-700 leading-relaxed list-disc list-inside">
                           {data.marketAnalysis.marketPainPoints?.map((p, i) => (
                              <li key={i}>{p}</li>
                           )) || <li>未提及</li>}
                        </ul>
                     </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                     <div>
                        <h5 className="font-medium text-slate-900 mb-2 text-sm">增长驱动力</h5>
                        <div className="flex flex-wrap gap-2">
                          {data.marketAnalysis.drivers.map((d, i) => (
                            <Badge key={i} color="blue">{d}</Badge>
                          ))}
                        </div>
                     </div>
                     <div>
                        <h5 className="font-medium text-slate-900 mb-2 text-sm">目标客户画像</h5>
                        <div className="flex flex-wrap gap-2">
                          {data.marketAnalysis.customerSegments && data.marketAnalysis.customerSegments.map((d, i) => (
                            <Badge key={i} color="purple">{d}</Badge>
                          ))}
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Financials */}
          <SectionCard title="财务轨迹与估值" icon={<DollarSign className="h-5 w-5" />}>
             <div className="grid grid-cols-2 gap-4 mb-6">
                {data.financialAnalysis.keyMetrics.slice(0, 4).map((m, i) => (
                  <div key={i} className="bg-slate-50 p-3 rounded-lg border border-transparent">
                    <p className="text-xs text-slate-500 uppercase">{m.label}</p>
                    <p className="font-semibold text-slate-800">{m.value}</p>
                  </div>
                ))}
             </div>
             
             {/* Chart */}
             <div className="h-56 w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.financialAnalysis.revenueChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none'}} />
                  <Bar dataKey="revenue" name="营收" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="利润" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
             </div>
             
             {/* Raw Data Table */}
             <div className="mb-6 overflow-x-auto">
                <table className="w-full text-sm text-right border-collapse border border-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-3 py-2 border border-slate-200 text-left text-slate-500 font-medium">年份</th>
                      <th className="px-3 py-2 border border-slate-200 text-slate-500 font-medium">营收</th>
                      <th className="px-3 py-2 border border-slate-200 text-slate-500 font-medium">利润</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.financialAnalysis.revenueChartData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                        <td className="px-3 py-2 border border-slate-200 text-left font-mono text-slate-700">{row.year}</td>
                        <td className="px-3 py-2 border border-slate-200 font-mono text-blue-600">{row.revenue}</td>
                        <td className="px-3 py-2 border border-slate-200 font-mono text-emerald-600">{row.profit}</td>
                      </tr>
                    ))}
                    {data.financialAnalysis.revenueChartData.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-slate-400">暂无财务数据</td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>

             {/* Valuation Section */}
             <div className="pt-6 border-t border-slate-100">
               <div className="flex items-center gap-2 mb-4">
                  <Scale className="h-4 w-4 text-slate-500" />
                  <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">估值分析与同业对标</h4>
               </div>
               
               <div className="bg-slate-50 rounded-lg p-4 mb-4 border border-slate-200">
                  <span className="text-xs text-slate-500 uppercase block mb-1">目标公司估值</span>
                  <span className="text-xl font-bold text-slate-900">{data.financialAnalysis.companyValuation || "未披露"}</span>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                      <tr>
                        <th className="px-2 py-2">公司名称</th>
                        <th className="px-2 py-2">代码</th>
                        <th className="px-2 py-2">市值/估值</th>
                        <th className="px-2 py-2">倍数</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.financialAnalysis.comparables && data.financialAnalysis.comparables.map((comp, i) => (
                        <tr key={i} className="hover:bg-slate-50/50">
                          <td className="px-2 py-2 font-medium text-slate-700">{comp.name}</td>
                          <td className="px-2 py-2 text-slate-500 font-mono text-xs">{comp.code}</td>
                          <td className="px-2 py-2 text-slate-600">{comp.valuation}</td>
                          <td className="px-2 py-2">
                             <span className="inline-block bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs border border-blue-100">
                               {comp.multiples}
                             </span>
                          </td>
                        </tr>
                      ))}
                      {(!data.financialAnalysis.comparables || data.financialAnalysis.comparables.length === 0) && (
                        <tr>
                           <td colSpan={4} className="px-2 py-4 text-center text-slate-400 text-xs italic">
                             未提供同行业上市公司数据
                           </td>
                        </tr>
                      )}
                    </tbody>
                 </table>
               </div>
             </div>

          </SectionCard>

          {/* Competition */}
          <SectionCard title="竞争格局" icon={<Target className="h-5 w-5" />}>
             <div className="mb-6">
               <h4 className="text-sm font-semibold text-slate-700 mb-2">护城河评估</h4>
               <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                 {data.competitiveLandscape.moat}
               </p>
             </div>

             <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">竞争综述</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                    {data.competitiveLandscape.summary}
                </p>
             </div>
             
             <h4 className="text-sm font-semibold text-slate-700 mb-3">波特五力模型</h4>
             
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
                 <div key={i} className="flex flex-col gap-1 text-sm border-b border-slate-50 pb-3 last:border-0">
                   <div className="flex items-center justify-between">
                     <span className="text-slate-600 font-medium">{f.aspect}</span>
                     <Badge color={f.strength === 'High' ? 'red' : f.strength === 'Medium' ? 'yellow' : 'green'}>
                       {getStrengthText(f.strength)}
                     </Badge>
                   </div>
                   {/* Removed truncate to show full text, added leading-relaxed */}
                   <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap">{f.comment}</p>
                 </div>
               ))}
             </div>
          </SectionCard>

          {/* SWOT Analysis - Full Width */}
          <div className="col-span-1 lg:col-span-2">
             <SectionCard title="SWOT 分析" icon={<MoveUpRight className="h-5 w-5" />}>
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
                      <h4 className="text-emerald-800 font-bold mb-3 flex items-center gap-2">
                         <span className="bg-emerald-200 text-emerald-800 rounded px-1.5 text-sm">S</span> 优势
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
                         <span className="bg-amber-200 text-amber-800 rounded px-1.5 text-sm">W</span> 劣势
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
                         <span className="bg-blue-200 text-blue-800 rounded px-1.5 text-sm">O</span> 机会
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
                         <span className="bg-rose-200 text-rose-800 rounded px-1.5 text-sm">T</span> 威胁
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

          {/* Investment Highlights - ADDED BEFORE RISKS */}
          <div className="col-span-1 lg:col-span-2">
            <SectionCard title="投资亮点" icon={<Sparkles className="h-5 w-5" />}>
              <div className="grid md:grid-cols-2 gap-4">
                {data.investmentHighlights?.map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 bg-amber-50 p-4 rounded-lg border border-amber-100 relative">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {i + 1}
                        </div>
                        <p className="text-slate-800 font-medium leading-relaxed text-sm">{item.highlight}</p>
                      </div>
                      <Badge color={item.rating === 'High' ? 'green' : 'yellow'}>{item.rating === 'High' ? '高' : '中'}</Badge>
                    </div>
                  </div>
                )) || <p className="text-slate-500">暂无特别亮点提取。</p>}
              </div>
            </SectionCard>
          </div>

          {/* Investment Risks - Renamed and Reformatted */}
          <div className="col-span-1 lg:col-span-2">
            <SectionCard title="投资风险" icon={<ShieldAlert className="h-5 w-5" />}>
              <div className="grid md:grid-cols-2 gap-4">
                {data.riskAssessment.risks.map((risk, i) => (
                  <div key={i} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-slate-300 transition-colors flex flex-col gap-2">
                     <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{risk.category}</span>
                        </div>
                        <Badge color={risk.severity === 'High' ? 'red' : risk.severity === 'Medium' ? 'yellow' : 'blue'}>
                          {getStrengthText(risk.severity)} 风险
                        </Badge>
                     </div>
                     <p className="text-slate-800 font-semibold text-sm leading-snug">{risk.risk}</p>
                     <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500 flex gap-2">
                        <span className="font-bold flex-shrink-0">应对:</span>
                        <span>{risk.mitigation}</span>
                     </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
          
          {/* Due Diligence Focus - Updated to SectionCard with Priorities and Sorting */}
          <div className="col-span-1 lg:col-span-2">
             <SectionCard title="后续尽调关注要点" icon={<SearchCheck className="h-5 w-5" />}>
                <div className="space-y-4">
                  {sortedDueDiligence.map((q, i) => (
                     <div key={i} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex-shrink-0">
                           <div className="flex flex-col items-center gap-1">
                              <span className="text-slate-300 font-bold text-lg leading-none font-mono">{(i + 1).toString().padStart(2, '0')}</span>
                           </div>
                        </div>
                        <div className="flex-grow">
                           <div className="flex justify-between items-start mb-1">
                              <p className="text-slate-800 font-medium leading-relaxed">{q.question}</p>
                              <div className="flex-shrink-0 ml-2">
                                 <Badge color={q.priority === 'High' ? 'red' : q.priority === 'Medium' ? 'yellow' : 'blue'}>
                                    {q.priority === 'High' ? '高优先级' : q.priority === 'Medium' ? '中优先级' : '低优先级'}
                                 </Badge>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
                  {sortedDueDiligence.length === 0 && (
                     <p className="text-slate-400 text-center italic">暂无尽调要点生成</p>
                  )}
                </div>
             </SectionCard>
          </div>
          
        </div>

        {/* Exit Strategy Footer */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center mb-6">
             {/* Paths */}
             <div className="p-4 bg-slate-50 rounded-lg flex flex-col justify-center">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">退出策略</p>
               <p className="font-semibold text-slate-800">{data.exitStrategy.paths.join(', ')}</p>
             </div>

             {/* Timeframe */}
             <div className="p-4 bg-slate-50 rounded-lg flex flex-col justify-between">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">预计时间周期</p>
                  <p className="font-semibold text-slate-800 text-lg">{data.exitStrategy.timeframe}</p>
               </div>
               <div className="mt-2 pt-2 border-t border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">测算依据</p>
                  <p className="text-[11px] text-slate-600 leading-tight">{data.exitStrategy.timeframeRationale || "未提供"}</p>
               </div>
             </div>

             {/* Returns */}
             <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex flex-col justify-between">
               <div>
                  <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">潜在回报</p>
                  <p className="font-semibold text-blue-700 text-lg">{data.exitStrategy.returnsPotential}</p>
               </div>
               <div className="mt-2 pt-2 border-t border-blue-200/50">
                  <p className="text-[10px] text-blue-400 uppercase tracking-wider mb-1">测算依据</p>
                  <p className="text-[11px] text-blue-800 leading-tight">{data.exitStrategy.returnsRationale || "未提供"}</p>
               </div>
             </div>

             {/* Placeholder for symmetry or summary */}
             <div className="p-4 bg-slate-50 rounded-lg flex flex-col justify-center text-slate-400 italic text-sm">
                <Info className="h-6 w-6 mx-auto mb-2 opacity-50" />
                <span>退出路径需结合资本市场环境动态评估</span>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};
