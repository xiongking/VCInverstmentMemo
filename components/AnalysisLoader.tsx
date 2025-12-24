
import React, { useState, useEffect } from 'react';
import { Cpu, Search, Database, BarChart3, FileText, Sparkles } from 'lucide-react';

const ANALYSIS_STEPS = [
  { icon: FileText, label: "正在解析文档结构...", sub: "DOC PARSING" },
  { icon: Search, label: "提取关键商业实体...", sub: "ENTITY EXTRACTION" },
  { icon: Database, label: "构建行业数据模型...", sub: "MARKET MODELING" },
  { icon: BarChart3, label: "计算估值与财务指标...", sub: "FINANCIAL COMPUTING" },
  { icon: Sparkles, label: "生成投资尽调报告...", sub: "INSIGHT GENERATION" },
];

export const AnalysisLoader: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepDuration = 2500; // 2.5 seconds per step
    
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const progress = ((currentStep + 1) / ANALYSIS_STEPS.length) * 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-2xl mx-auto font-sans">
      {/* Central Visual - Flat & Monochrome */}
      <div className="relative mb-12">
        <div className="h-32 w-32 bg-white rounded-full border-2 border-slate-900 flex items-center justify-center z-10 overflow-hidden">
          {ANALYSIS_STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
                  index === currentStep 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-75'
                }`}
              >
                <Icon className="h-12 w-12 text-slate-900" strokeWidth={1.5} />
              </div>
            );
          })}
        </div>
        
        {/* Simple Ring Animation */}
        <div className="absolute inset-0 border border-dashed border-slate-300 rounded-full animate-[spin_10s_linear_infinite] w-48 h-48 -m-8 -z-10"></div>
      </div>

      {/* Text Status */}
      <div className="text-center space-y-3 mb-10">
        <h3 className="text-xl font-medium text-slate-900 tracking-wide">
          {ANALYSIS_STEPS[currentStep].label}
        </h3>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
          AI PROCESSING
        </p>
      </div>

      {/* Flat Progress Bar */}
      <div className="w-full h-1 bg-slate-100 rounded-none overflow-hidden max-w-md">
        <div 
          className="h-full bg-slate-900 transition-all duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Step Indicators - Simple Dots */}
      <div className="flex justify-between w-full max-w-md mt-6 px-1">
        {ANALYSIS_STEPS.map((_, index) => (
          <div 
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 border border-slate-900 ${
              index <= currentStep ? 'bg-slate-900' : 'bg-transparent border-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
