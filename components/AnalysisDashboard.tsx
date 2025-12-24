
import React, { useState } from 'react';
import { AnalysisReport, DeepDiveItem } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { 
  TrendingUp, ShieldAlert, DollarSign, Target, Activity, 
  CheckCircle2, XCircle, AlertCircle, Briefcase, 
  MoveUpRight, Zap, SearchCheck, Info,
  Gavel, AlertTriangle, Cpu, Layers, ShoppingBag, Truck, Download, RotateCcw,
  X, ChevronRight, CircuitBoard
} from 'lucide-react';

interface DashboardProps {
  data: AnalysisReport;
  onReset: () => void;
}

// Visual Component: Section Header (Flat)
const SectionHeader: React.FC<{ title: string; icon: React.ReactNode }> = ({ title, icon }) => (
  <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
    <div className="text-slate-900">
      {icon}
    </div>
    <h3 className="text-base font-semibold text-slate-900 tracking-tight">{title}</h3>
  </div>
);

// Visual Component: Mini Data Card (Flat)
const MiniCard: React.FC<{ label: string; value: string; trend?: string }> = ({ label, value, trend }) => {
  return (
    <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <p className="text-2xl font-semibold text-slate-900 tracking-tight">
        {value}
      </p>
      {trend && <p className="text-xs text-slate-500 mt-2">{trend}</p>}
    </div>
  );
};

// Visual Component: Main Content Card (Flat)
const ContentCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`}>
    {children}
  </div>
);

// Visual Component: Badge (Flat & Monochrome)
const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200 whitespace-normal text-center">
      {children}
    </span>
  );
};

// Visual Component: Deep Dive Card with Modal Trigger
const DeepDiveCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  item: DeepDiveItem;
  onOpenModal: (title: string, content: string) => void; 
}> = ({ icon, title, item, onOpenModal }) => (
  <div className="p-6 bg-white flex flex-col h-full">
    <div className="flex items-center gap-2 mb-4">
      <div className="text-slate-400">{icon}</div>
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
    </div>
    <div className="flex-grow">
      <ul className="space-y-3 mb-6">
        {item.summaryPoints.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
             <div className="h-1.5 w-1.5 rounded-full bg-slate-300 mt-1.5 flex-shrink-0" />
             <span className="text-xs text-slate-600 leading-relaxed text-justify">{point}</span>
          </li>
        ))}
      </ul>
    </div>
    <button 
      onClick={() => onOpenModal(title, item.detailedContent)}
      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all group"
    >
      <span>{item.buttonLabel}</span>
      <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
    </button>
  </div>
);

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

  const getVerdictText = (v: string) => {
    switch (v) {
      case 'Invest': return '建议投资';
      case 'Watch': return '保持关注';
      case 'Pass': return '建议放弃';
      default: return v;
    }
  };

  const getVerdictStyles = (v: string) => {
    return { bg: 'bg-slate-900', text: 'text-white', icon: v === 'Invest' ? CheckCircle2 : v === 'Pass' ? XCircle : AlertCircle };
  };

  const getPriorityScore = (p: string) => {
    switch(p) {
      case 'High': return 3;
      case 'Medium': return 2;
      case 'Low': return 1;
      default: return 0;
    }
  };
  
  const handleDownloadMarkdown = () => {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    
    const { 
      executiveSummary, finalRecommendation, companyAnalysis, businessDeepDive, 
      marketAnalysis, financialAnalysis, competitiveLandscape, swotAnalysis, 
      riskAssessment, exitStrategy 
    } = data;

     const markdownContent = `
# 投资备忘录：${companyAnalysis.name}
**生成时间**: ${now.toLocaleString('zh-CN')}
**初判结果**: ${getVerdictText(executiveSummary.preliminaryVerdict)}

---

## 1. 核心结论
**决策依据**: ${executiveSummary.verdictReason}
**核心观点**:
${executiveSummary.coreViewpoints.map(v => `- ${v}`).join('\n')}

## 2. 投资论点
${finalRecommendation.investmentThesis}

## 3. 公司与团队
**简介**: ${companyAnalysis.businessModel}
**团队**: ${companyAnalysis.teamAssessment}
${companyAnalysis.teamMembers.map(m => `- ${m.name} (${m.role}): ${m.background}`).join('\n')}

## 4. 深度业务解析
### 核心技术方案
**要点**:
${businessDeepDive.technicalSolution.summaryPoints.map(p => `- ${p}`).join('\n')}
> **详细内容**:
> ${businessDeepDive.technicalSolution.detailedContent.replace(/\n/g, '\n> ')}

### 产品矩阵
**要点**:
${businessDeepDive.productPortfolio.summaryPoints.map(p => `- ${p}`).join('\n')}
> **详细内容**:
> ${businessDeepDive.productPortfolio.detailedContent.replace(/\n/g, '\n> ')}

### 商业落地
**要点**:
${businessDeepDive.commercializationPath.summaryPoints.map(p => `- ${p}`).join('\n')}
> **详细内容**:
> ${businessDeepDive.commercializationPath.detailedContent.replace(/\n/g, '\n> ')}

### 运营交付
**要点**:
${businessDeepDive.operationalStrengths.summaryPoints.map(p => `- ${p}`).join('\n')}
> **详细内容**:
> ${businessDeepDive.operationalStrengths.detailedContent.replace(/\n/g, '\n> ')}

## 5. 行业及市场
**规模**: ${marketAnalysis.marketSize} | CAGR: ${marketAnalysis.cagr}
**技术趋势**:
${marketAnalysis.techTrends.map(t => `- ${t}`).join('\n')}
**综述**: ${marketAnalysis.summary}

## 6. 竞争格局
**护城河**: ${competitiveLandscape.moat}
**五力分析**:
${competitiveLandscape.portersFiveForces.map(f => `- ${f.aspect} [${f.strength}]: ${f.comment}`).join('\n')}

## 7. SWOT
**S**: ${swotAnalysis.strengths.join('; ')}
**W**: ${swotAnalysis.weaknesses.join('; ')}
**O**: ${swotAnalysis.opportunities.join('; ')}
**T**: ${swotAnalysis.threats.join('; ')}

## 8. 财务与估值
**估值**: ${financialAnalysis.companyValuation}
**关键指标**: ${financialAnalysis.keyMetrics.map(m => `${m.label}: ${m.value}`).join(', ')}

## 9. 风险
${riskAssessment.risks.map(r => `- ${r.category} [${r.severity}]: ${r.risk}`).join('\n')}

## 10. 退出
${exitStrategy.paths.join(', ')} (预计 ${exitStrategy.timeframe})
> ${exitStrategy.returnsRationale}

---
*Generated by AI Investment Analyst*
`; 
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${companyAnalysis.name}_Memo_${formattedTime}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Radar Data
  const portersData = data.competitiveLandscape.portersFiveForces.map(item => ({
    subject: item.aspect,
    A: item.strength === 'High' ? 3 : item.strength === 'Medium' ? 2 : 1,
    fullMark: 3,
  }));

  const sortedDueDiligence = [...data.finalRecommendation.dueDiligenceFocus].sort(
    (a, b) => getPriorityScore(b.priority) - getPriorityScore(a.priority)
  );

  const verdict = getVerdictStyles(data.executiveSummary.preliminaryVerdict);
  const VerdictIcon = verdict.icon;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      
      {/* Modal Overlay */}
      {modalOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={handleCloseModal} />
          <div className="relative bg-white w-full max-w-2xl max-h-[85vh] rounded-xl shadow-2xl flex flex-col animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">{modalContent.title} - 详细内容</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto leading-loose text-sm text-slate-700 whitespace-pre-wrap">
              {modalContent.content}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end">
               <button onClick={handleCloseModal} className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800">
                 关闭
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 bg-slate-900 rounded flex items-center justify-center text-white">
                <Briefcase className="h-4 w-4" />
             </div>
             <div>
               <h1 className="text-base font-bold text-slate-900 leading-none">投资决策助手</h1>
               <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Investment Memo</span>
             </div>
          </div>
          <div className="flex gap-3">
             <button onClick={handleDownloadMarkdown} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 transition-all">
               <Download className="h-3.5 w-3.5" />
               下载报告
             </button>
             <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-black rounded transition-all">
               <RotateCcw className="h-3.5 w-3.5" />
               新分析
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* Hero Section */}
        <div className="flex flex-col gap-6">
           <div className={`w-full rounded-lg p-8 flex flex-col justify-between border border-slate-200 ${verdict.bg}`}>
              <div>
                 <div className="flex items-center gap-2 mb-4 opacity-80">
                    <VerdictIcon className="h-5 w-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">AI 建议</span>
                 </div>
                 <h2 className="text-3xl font-bold text-white tracking-tight mb-2">
                    {getVerdictText(data.executiveSummary.preliminaryVerdict)}
                 </h2>
                 <p className="text-sm text-slate-300 leading-relaxed mt-4 border-t border-slate-700 pt-4">
                    {data.executiveSummary.verdictReason}
                 </p>
              </div>
           </div>

           <div className="w-full bg-white rounded-lg p-8 border border-slate-200 flex flex-col justify-center">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">投资核心论点</h3>
              <p className="text-xl font-medium text-slate-900 leading-relaxed font-serif">
                "{data.finalRecommendation.investmentThesis}"
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                 {data.executiveSummary.coreViewpoints.map((pt, i) => (
                    <span key={i} className="px-3 py-1 bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200 whitespace-normal h-auto">
                       {pt}
                    </span>
                 ))}
              </div>
           </div>
        </div>

        {/* Section 1: Company & Team */}
        <ContentCard>
           <SectionHeader title="公司与团队" icon={<Activity className="h-4 w-4" />} />
           
           <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-4">
                 <div className="p-4 bg-slate-50 rounded border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">团队评估</h4>
                    <p className="text-sm text-slate-800 leading-relaxed text-justify">
                       {data.companyAnalysis.teamAssessment}
                    </p>
                 </div>
                 <div className="p-4 rounded border border-slate-200">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">目标公司</h4>
                    <p className="text-lg font-bold text-slate-900">{data.companyAnalysis.name}</p>
                 </div>
              </div>

              <div className="lg:col-span-2">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">核心成员</h4>
                 <div className="grid gap-4">
                    {data.companyAnalysis.teamMembers?.map((member, i) => (
                      <div key={i} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                         <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600 font-bold text-sm">
                            {member.name.charAt(0)}
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span className="font-bold text-slate-900 text-sm">{member.name}</span>
                               <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase border border-slate-200">{member.role}</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{member.background}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </ContentCard>

        {/* Section 2: Deep Dive (Modified for Lists & Floating Window) */}
        <ContentCard>
          <SectionHeader title="深度解析" icon={<Layers className="h-4 w-4" />} />
          <div className="grid md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded overflow-hidden">
             <DeepDiveCard 
                icon={<Cpu className="h-5 w-5" />} 
                title="核心技术方案" 
                item={data.businessDeepDive.technicalSolution} 
                onOpenModal={handleOpenModal} 
             />
             <DeepDiveCard 
                icon={<ShoppingBag className="h-5 w-5" />} 
                title="产品矩阵" 
                item={data.businessDeepDive.productPortfolio} 
                onOpenModal={handleOpenModal} 
             />
             <DeepDiveCard 
                icon={<Briefcase className="h-5 w-5" />} 
                title="商业落地" 
                item={data.businessDeepDive.commercializationPath} 
                onOpenModal={handleOpenModal} 
             />
             <DeepDiveCard 
                icon={<Truck className="h-5 w-5" />} 
                title="运营交付" 
                item={data.businessDeepDive.operationalStrengths} 
                onOpenModal={handleOpenModal} 
             />
          </div>
        </ContentCard>

        {/* Section 3: Market Analysis (Modified: No Chart, Tech Trends Added) */}
        <ContentCard>
           <SectionHeader title="行业及市场" icon={<TrendingUp className="h-4 w-4" />} />
           
           <div className="mb-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                 <MiniCard label="市场规模 (TAM)" value={data.marketAnalysis.marketSize} />
                 <MiniCard label="复合增长率 (CAGR)" value={data.marketAnalysis.cagr} trend="预测增长" />
              </div>

              {/* New Tech Trends Section */}
              <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-lg">
                 <div className="flex items-center gap-2 mb-4">
                    <CircuitBoard className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">行业技术趋势分析</h4>
                 </div>
                 <div className="grid md:grid-cols-2 gap-4">
                    {data.marketAnalysis.techTrends.map((trend, i) => (
                       <div key={i} className="flex gap-3 items-start p-3 bg-white rounded border border-slate-200">
                          <div className="h-1.5 w-1.5 rounded-full bg-slate-900 mt-2 flex-shrink-0" />
                          <p className="text-xs font-medium text-slate-700 leading-relaxed">{trend}</p>
                       </div>
                    ))}
                 </div>
              </div>

              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">市场综述</h4>
                 <div className="p-4 rounded border border-slate-100 bg-white">
                    <p className="text-sm text-slate-700 leading-relaxed text-justify">
                        {data.marketAnalysis.summary}
                    </p>
                 </div>
              </div>
           </div>

           {/* Integrated Sub-sections */}
           <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
              <div className="space-y-3">
                 <div className="flex items-center gap-2 mb-1">
                    <Gavel className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">政策监管</h4>
                 </div>
                 <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100 h-full">
                    {data.marketAnalysis.regulatoryEnvironment || "无特别监管政策提及"}
                 </p>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">市场痛点</h4>
                 </div>
                 <ul className="space-y-2 bg-slate-50 p-3 rounded border border-slate-100 h-full">
                    {data.marketAnalysis.marketPainPoints?.map((p, i) => (
                       <li key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                          <span className="text-slate-400">•</span>
                          {p}
                       </li>
                    ))}
                 </ul>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center gap-2 mb-1">
                    <Zap className="h-4 w-4 text-slate-400" />
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">驱动因素</h4>
                 </div>
                 <div className="flex flex-wrap gap-2 bg-slate-50 p-3 rounded border border-slate-100 h-full content-start">
                    {data.marketAnalysis.drivers.map((d, i) => (
                       <Badge key={i}>{d}</Badge>
                    ))}
                 </div>
              </div>
           </div>
        </ContentCard>

        {/* Section 4: Financials */}
        <ContentCard>
           <SectionHeader title="财务与估值" icon={<DollarSign className="h-4 w-4" />} />
           
           <div className="grid lg:grid-cols-2 gap-8">
              <div>
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="col-span-2 p-4 bg-slate-900 rounded text-white">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">目标公司估值</p>
                       <p className="text-2xl font-bold tracking-tight text-white">{data.financialAnalysis.companyValuation || "未披露"}</p>
                    </div>
                    {data.financialAnalysis.keyMetrics.slice(0, 4).map((m, i) => (
                      <div key={i} className="p-3 bg-white rounded border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{m.label}</p>
                        <p className="text-base font-bold text-slate-900">{m.value}</p>
                      </div>
                    ))}
                 </div>
                 <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.financialAnalysis.revenueChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 500}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 500}} />
                        <Tooltip contentStyle={{borderRadius: '0px', border: '1px solid #e2e8f0', boxShadow: 'none'}} cursor={{fill: '#f1f5f9'}} />
                        <Bar dataKey="revenue" name="营收" fill="#334155" radius={[0, 0, 0, 0]} barSize={30} />
                        <Bar dataKey="profit" name="利润" fill="#94a3b8" radius={[0, 0, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div>
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">可比公司对标</h4>
                 <div className="overflow-hidden rounded border border-slate-200">
                    <table className="w-full text-xs">
                       <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                          <tr>
                             <th className="px-4 py-3 text-left border-b border-slate-200">公司名称</th>
                             <th className="px-4 py-3 text-left border-b border-slate-200">代码/状态</th>
                             <th className="px-4 py-3 text-left border-b border-slate-200">估值/市值</th>
                             <th className="px-4 py-3 text-left border-b border-slate-200">倍数</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100 bg-white">
                          {data.financialAnalysis.comparables?.map((comp, i) => (
                             <tr key={i} className="hover:bg-slate-50 transition-colors">
                                <td className="px-4 py-3 font-bold text-slate-800 text-left">{comp.name}</td>
                                <td className="px-4 py-3 font-mono text-slate-400 text-left">{comp.code}</td>
                                <td className="px-4 py-3 font-medium text-slate-600 text-left">{comp.valuation}</td>
                                <td className="px-4 py-3 text-left"><Badge>{comp.multiples}</Badge></td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
                 <div className="mt-6 p-4 bg-slate-50 rounded border border-slate-100">
                    <p className="text-xs text-slate-600 leading-relaxed text-justify">
                       {data.financialAnalysis.summary}
                    </p>
                 </div>
              </div>
           </div>
        </ContentCard>

        {/* Section 5: Competition */}
        <ContentCard>
           <SectionHeader title="竞争格局" icon={<Target className="h-4 w-4" />} />
           <div className="grid md:grid-cols-2 gap-8">
               <div className="h-64 w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={portersData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 500 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
                      <Radar name="Intensity" dataKey="A" stroke="#334155" strokeWidth={2} fill="#334155" fillOpacity={0.2} />
                      <Tooltip contentStyle={{borderRadius: '0px', border: '1px solid #e2e8f0'}} />
                    </RadarChart>
                  </ResponsiveContainer>
               </div>
               <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100">
                     <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">护城河</h5>
                     <p className="text-xs font-medium text-slate-700">{data.competitiveLandscape.moat}</p>
                  </div>
                  {data.competitiveLandscape.portersFiveForces.map((f, i) => (
                    <div key={i} className="flex justify-between items-start border-b border-slate-100 pb-2 last:border-0">
                      <span className="text-xs font-bold text-slate-700 w-1/3">{f.aspect}</span>
                      <p className="text-xs text-slate-500 w-2/3 pl-2 text-right">{f.comment}</p>
                    </div>
                  ))}
               </div>
           </div>
        </ContentCard>

        {/* Section 6: Risk Assessment */}
        <ContentCard>
           <SectionHeader title="风险评估" icon={<ShieldAlert className="h-4 w-4" />} />
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.riskAssessment.risks.map((risk, i) => (
                 <div key={i} className="p-4 rounded border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-bold text-slate-900 uppercase">{risk.category}</span>
                       <span className="text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded">
                          {risk.severity === 'High' ? '高' : risk.severity === 'Medium' ? '中' : '低'}风险
                       </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 mb-2">{risk.risk}</p>
                    <div className="flex gap-2 items-start text-xs text-slate-500">
                       <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
                       <span>{risk.mitigation}</span>
                    </div>
                 </div>
              ))}
           </div>
        </ContentCard>

        {/* Section 7: SWOT */}
        <ContentCard>
           <SectionHeader title="SWOT 分析" icon={<MoveUpRight className="h-4 w-4" />} />
           <div className="grid md:grid-cols-2 gap-px bg-slate-200 border border-slate-200 rounded overflow-hidden">
              <div className="p-6 bg-white">
                 <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">S 优势 (Strengths)</h4>
                 <ul className="space-y-1.5">{data.swotAnalysis.strengths.map((s,i) => <li key={i} className="text-xs text-slate-600">• {s}</li>)}</ul>
              </div>
              <div className="p-6 bg-white">
                 <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">W 劣势 (Weaknesses)</h4>
                 <ul className="space-y-1.5">{data.swotAnalysis.weaknesses.map((s,i) => <li key={i} className="text-xs text-slate-600">• {s}</li>)}</ul>
              </div>
              <div className="p-6 bg-white">
                 <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">O 机会 (Opportunities)</h4>
                 <ul className="space-y-1.5">{data.swotAnalysis.opportunities.map((s,i) => <li key={i} className="text-xs text-slate-600">• {s}</li>)}</ul>
              </div>
              <div className="p-6 bg-white">
                 <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-3">T 威胁 (Threats)</h4>
                 <ul className="space-y-1.5">{data.swotAnalysis.threats.map((s,i) => <li key={i} className="text-xs text-slate-600">• {s}</li>)}</ul>
              </div>
           </div>
        </ContentCard>

        {/* Footer: Exit & DD */}
        <div className="flex flex-col gap-6">
           <ContentCard className="bg-slate-900 text-white border-slate-900">
               <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-4">
                  <MoveUpRight className="h-4 w-4 text-white" />
                  <h3 className="text-base font-semibold text-white tracking-tight">退出策略</h3>
               </div>
               <div className="space-y-6">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">退出路径</p>
                     <p className="text-lg font-bold text-white">{data.exitStrategy.paths.join(', ')}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">预计周期</p>
                        <p className="text-xl font-bold text-white">{data.exitStrategy.timeframe}</p>
                     </div>
                     <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">潜在回报</p>
                        <p className="text-xl font-bold text-white">{data.exitStrategy.returnsPotential}</p>
                     </div>
                  </div>
                  <div className="pt-4 border-t border-slate-700">
                     <p className="text-[10px] text-slate-400 leading-relaxed italic">
                        "{data.exitStrategy.timeframeRationale}"
                     </p>
                  </div>
               </div>
           </ContentCard>

           <ContentCard>
              <SectionHeader title="尽调核心关注" icon={<SearchCheck className="h-4 w-4" />} />
              <div className="space-y-3">
                 {sortedDueDiligence.map((dd, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded border border-slate-100">
                       <span className="flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-[10px] font-bold text-slate-600 flex-shrink-0">
                          {i+1}
                       </span>
                       <div className="flex-grow">
                          <p className="text-sm font-bold text-slate-800 mb-1">{dd.question}</p>
                       </div>
                       <span className="text-[10px] font-bold bg-white border border-slate-200 px-2 py-1 rounded text-slate-600">
                          {dd.priority === 'High' ? '高' : dd.priority === 'Medium' ? '中' : '低'}优先级
                       </span>
                    </div>
                 ))}
              </div>
           </ContentCard>
        </div>

      </main>
    </div>
  );
};
