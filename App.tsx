
import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AnalysisLoader } from './components/AnalysisLoader';
import { analyzeBusinessPlan } from './services/geminiService';
import { AnalysisReport, AppStatus } from './types';
import { Sparkles } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (file: File) => {
    setStatus(AppStatus.ANALYZING);
    setError(null);
    try {
      const result = await analyzeBusinessPlan(file);
      setReport(result);
      setStatus(AppStatus.COMPLETE);
    } catch (err) {
      console.error(err);
      setError("分析失败。请稍后重试，或检查您的 API 密钥/网络连接。");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-slate-50">
      {status === AppStatus.IDLE ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
          
          <header className="mb-16 text-center flex flex-col items-center max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 border border-slate-200 rounded-full bg-white">
              <Sparkles className="h-3.5 w-3.5 text-slate-900" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">AI 智能投资分析师</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold text-slate-900 tracking-tight mb-6 leading-tight">
              商业计划书<br />深度解读
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed font-light">
              上传 PDF 文档，即刻生成极简风格的投资备忘录与估值分析报告。
            </p>
          </header>
          
          <div className="w-full max-w-3xl">
            <InputSection onAnalyze={handleAnalyze} isLoading={false} />
          </div>
        </div>
      ) : status === AppStatus.ANALYZING ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-full">
            <AnalysisLoader />
          </div>
        </div>
      ) : status === AppStatus.ERROR ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
           <div className="p-8 bg-white border border-slate-200 rounded-lg max-w-md text-center shadow-sm">
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900">
                !
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">分析中止</h3>
              <p className="text-slate-500 mb-6">{error}</p>
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="px-6 py-2.5 bg-slate-900 text-white text-sm font-medium rounded hover:bg-slate-800 transition-colors"
              >
                返回首页
              </button>
            </div>
        </div>
      ) : (
        report && <AnalysisDashboard data={report} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;
