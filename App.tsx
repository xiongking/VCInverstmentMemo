import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { analyzeBusinessPlan } from './services/geminiService';
import { AnalysisReport, AppStatus } from './types';

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {status === AppStatus.IDLE || status === AppStatus.ANALYZING || status === AppStatus.ERROR ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <header className="mb-12 text-center flex flex-col items-center">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              商业计划书解读
            </h1>
          </header>
          
          <InputSection onAnalyze={handleAnalyze} isLoading={status === AppStatus.ANALYZING} />
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg max-w-md text-center">
              {error}
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="block mx-auto mt-2 text-sm font-bold hover:underline"
              >
                重试
              </button>
            </div>
          )}
        </div>
      ) : (
        report && <AnalysisDashboard data={report} onReset={handleReset} />
      )}
    </div>
  );
}

export default App;