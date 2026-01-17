
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Cpu } from 'lucide-react';

const LOG_MESSAGES = [
  "正在初始化 PDF 解析引擎...",
  "读取文档结构与元数据...",
  "提取核心章节：执行摘要、财务数据、团队介绍...",
  "启动 DeepSeek V3 推理模型...",
  "STORM 引擎介入：生成 3 个独立视角的尽调查询...",
  "> 查询生成：'行业市场规模最新报告 2024'...",
  "> 查询生成：'主要竞争对手技术路线对比'...",
  "> 查询生成：'核心团队过往创业经历背景调查'...",
  "正在连接 Tavily API 执行全网深度搜索...",
  "检索到 12 个相关外部信源...",
  "正在交叉验证 TAM (潜在市场规模) 数据...",
  "发现数据差异：BP 宣称 500亿 vs 第三方报告 350亿...",
  "标记风险点：市场规模可能被高估...",
  "正在构建波特五力分析模型...",
  "评估供应商议价能力... [中]",
  "评估潜在进入者威胁... [高]",
  "正在进行财务模型压力测试...",
  "计算关键指标：CAGR, EBITDA Margin, MOIC...",
  "生成风险缓解策略...",
  "正在撰写最终投资备忘录 (Investment Memo)...",
  "格式化输出：JSON Schema 校验通过...",
  "准备渲染数据大盘..."
];

export const AnalysisLoader: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIndex = 0;
    
    // Initial log
    setLogs([LOG_MESSAGES[0]]);

    const interval = setInterval(() => {
      if (currentIndex < LOG_MESSAGES.length - 1) {
        currentIndex++;
        setLogs(prev => [...prev, LOG_MESSAGES[currentIndex]]);
      }
    }, 800); // Add a new log line every 800ms

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full font-sans px-4">
      
      {/* Icon Animation */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <div className="relative z-10 bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
           <Cpu className="h-10 w-10 text-[#1d1d1f] animate-pulse" strokeWidth={1.5} />
        </div>
      </div>

      <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-8 animate-fade-in text-center">
        正在生成深度尽调报告...
      </h3>

      {/* Transparent Log Container */}
      <div className="w-full max-w-2xl relative">
          {/* Fade gradient at top */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#F5F5F7] to-transparent z-10 pointer-events-none"></div>
          
          <div 
            ref={scrollRef}
            className="h-64 overflow-y-auto space-y-4 px-4 py-4 scroll-smooth"
            style={{ 
               scrollbarWidth: 'none', 
               msOverflowStyle: 'none',
               maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)' 
            }}
          >
            {logs.map((log, index) => {
                const isLast = index === logs.length - 1;
                return (
                    <div 
                        key={index} 
                        className={`
                            flex gap-3 text-sm font-medium transition-all duration-500
                            ${isLast ? 'text-[#1d1d1f] scale-100 opacity-100 translate-y-0' : 'text-gray-400 scale-95 opacity-60'}
                        `}
                    >
                        <span className="flex-shrink-0 opacity-50 text-[10px] pt-1 font-mono">
                            {/* Simple Step Number */}
                            {index + 1 < 10 ? `0${index + 1}` : index + 1}
                        </span>
                        <span className={log.startsWith(">") ? "text-blue-600" : ""}>
                            {log}
                        </span>
                    </div>
                )
            })}
             {/* Simple cursor or loading indicator at bottom */}
             <div className="flex justify-center pt-2">
                 <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                     <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                     <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
             </div>
          </div>
      </div>
    </div>
  );
};
