
import React, { useState, useEffect } from 'react';
import { InputSection } from './components/InputSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { AnalysisLoader } from './components/AnalysisLoader';
import { SettingsModal } from './components/SettingsModal';
import { HistoryModal } from './components/HistoryModal';
import { analyzeBusinessPlanDeepSeek } from './services/analysisService';
import { AnalysisReport, AppStatus, ApiSettings, DEFAULT_SETTINGS, HistoryItem } from './types';
import { Sparkles, Command, Settings2, History } from 'lucide-react';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Settings State
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<ApiSettings>(() => {
    const saved = localStorage.getItem('app_api_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // History State
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('app_analysis_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleSaveSettings = (newSettings: ApiSettings) => {
    setSettings(newSettings);
    localStorage.setItem('app_api_settings', JSON.stringify(newSettings));
  };

  const saveToHistory = (file: File, newReport: AnalysisReport) => {
     const newItem: HistoryItem = {
        id: Date.now().toString(),
        fileName: file.name,
        timestamp: Date.now(),
        report: newReport
     };
     const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20
     setHistory(updatedHistory);
     localStorage.setItem('app_analysis_history', JSON.stringify(updatedHistory));
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('app_analysis_history');
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setReport(item.report);
    setStatus(AppStatus.COMPLETE);
  };

  const handleAnalyze = async (file: File) => {
    setStatus(AppStatus.ANALYZING);
    setError(null);
    try {
      // Use the DeepSeek service
      const result = await analyzeBusinessPlanDeepSeek(file, settings);
      setReport(result);
      setStatus(AppStatus.COMPLETE);
      saveToHistory(file, result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "分析失败。请检查 API Key 配置或网络连接。");
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen">
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        settings={settings} 
        onSave={handleSaveSettings} 
      />
      
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelect={handleSelectHistory}
        onClear={handleClearHistory}
      />

      {status === AppStatus.IDLE ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
          
          {/* Subtle Ambient Light (Aurora) */}
          <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-blue-100/40 via-purple-100/30 to-transparent rounded-[100%] blur-[100px] -z-10 pointer-events-none" />

          {/* Top Buttons */}
          <div className="absolute top-6 right-6 z-20 flex gap-3">
            <button 
              onClick={() => setHistoryOpen(true)}
              className="p-3 bg-white/50 backdrop-blur-md hover:bg-white rounded-full shadow-sm text-[#1d1d1f] transition-all hover:scale-105"
              title="历史记录"
            >
              <History className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setSettingsOpen(true)}
              className="p-3 bg-white/50 backdrop-blur-md hover:bg-white rounded-full shadow-sm text-[#1d1d1f] transition-all hover:scale-105"
              title="设置"
            >
              <Settings2 className="h-5 w-5" />
            </button>
          </div>

          <header className="mb-12 text-center flex flex-col items-center max-w-4xl relative z-10 animate-fade-in-up">
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 bg-[#1d1d1f] rounded-full shadow-lg">
               <Sparkles className="h-3 w-3 text-yellow-400" fill="currentColor" />
               <span className="text-[10px] font-semibold text-white tracking-wide uppercase">AI Insight Pro</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-semibold text-[#1d1d1f] tracking-tighter mb-6 leading-[1.05]">
              商业计划书<br />
              <span className="text-[#86868b]">深度洞察系统</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-[#1d1d1f] leading-relaxed font-normal max-w-2xl mx-auto">
              上传 PDF，获取专业级投资尽调报告。<br/>
              <span className="text-[#86868b]">AI 深度推理 + 实时市场数据验证。</span>
            </p>
          </header>
          
          <div className="w-full max-w-xl relative z-10">
            <InputSection onAnalyze={handleAnalyze} isLoading={false} />
          </div>

          <footer className="absolute bottom-6 text-xs text-[#86868b] font-medium tracking-wide flex items-center gap-2">
             <Command className="h-3 w-3" />
             <span>POWERED BY AI INSIGHT ENGINE</span>
          </footer>
        </div>
      ) : status === AppStatus.ANALYZING ? (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
          <div className="w-full">
            <AnalysisLoader />
          </div>
        </div>
      ) : status === AppStatus.ERROR ? (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-[#F5F5F7]">
           <div className="p-12 bg-white rounded-[32px] max-w-md text-center shadow-2xl shadow-black/5">
              <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-semibold text-[#1d1d1f] mb-3 tracking-tight">分析中止</h3>
              <p className="text-[#86868b] mb-8 leading-relaxed text-lg">{error}</p>
              <div className="space-y-3">
                <button 
                  onClick={() => setStatus(AppStatus.IDLE)}
                  className="w-full px-8 py-4 bg-[#0071e3] text-white text-base font-medium rounded-full hover:bg-[#0077ED] transition-all active:scale-95"
                >
                  重试
                </button>
                <button 
                  onClick={() => { setStatus(AppStatus.IDLE); setSettingsOpen(true); }}
                  className="w-full px-8 py-4 bg-[#F5F5F7] text-[#1d1d1f] text-base font-medium rounded-full hover:bg-[#E5E5EA] transition-all"
                >
                  检查 API 设置
                </button>
              </div>
            </div>
        </div>
      ) : (
        <>
            {/* Show Header controls even in dashboard view for easy access to history */}
            <div className="fixed top-4 right-6 z-50 flex gap-3">
                 <button 
                  onClick={() => setHistoryOpen(true)}
                  className="p-2.5 bg-white/80 backdrop-blur-md hover:bg-white rounded-full shadow-sm text-[#1d1d1f] transition-all hover:scale-105 border border-white/20"
                  title="历史记录"
                >
                  <History className="h-4 w-4" />
                </button>
            </div>
            {report && <AnalysisDashboard data={report} onReset={handleReset} />}
        </>
      )}
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  )
}

export default App;
