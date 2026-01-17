
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ANALYSIS_STEPS = [
  "正在解析商业计划书结构...",
  "智能引擎启动：识别关键尽调维度...",
  "多视角发散：生成市场、竞品、风险验证议题...",
  "深度检索中：并行执行多路全网搜索...",
  "信息综合：交叉比对 BP 宣称与外部事实...",
  "正在生成最终投资决策报告..."
];

export const AnalysisLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Slightly slower steps to match the deeper analysis time
    const stepDuration = 3500; 
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev));
    }, stepDuration);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full font-sans">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Loader2 className="h-12 w-12 text-[#1d1d1f] animate-spin relative z-10" strokeWidth={1.5} />
      </div>

      <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-3 animate-fade-in text-center px-4">
        {ANALYSIS_STEPS[currentStep]}
      </h3>
      <p className="text-[#86868b] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        Powered by AI Insight Engine
      </p>
    </div>
  );
};
