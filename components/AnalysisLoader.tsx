
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Terminal, Cpu } from 'lucide-react';

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

      <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-6 animate-fade-in text-center">
        正在生成深度尽调报告...
      </h3>

      {/* Terminal Window */}
      <div className="w-full max-w-2xl bg-[#1e1e1e] rounded-xl shadow-2xl overflow-hidden border border-gray-800 font-mono text-sm">
        {/* Terminal Header */}
        <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-700">
          <Terminal className="h-3 w-3 text-gray-400" />
          <span className="text-gray-400 text-xs">AI Insight Engine — Analysis Log</span>
          <div className="flex gap-1.5 ml-auto">
             <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
             <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
          </div>
        </div>
        
        {/* Terminal Content (Scrolling) */}
        <div 
          ref={scrollRef}
          className="h-64 overflow-y-auto p-4 space-y-2 text-green-400 scroll-smooth"
        >
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-gray-500 flex-shrink-0">[{new Date().toLocaleTimeString([], {hour12: false, hour: "2-digit", minute:"2-digit", second:"2-digit"})}]</span>
              <span className={log.startsWith(">") ? "text-yellow-300" : "text-green-400"}>
                {log}
              </span>
            </div>
          ))}
          <div className="animate-pulse text-green-400">_</div>
        </div>
      </div>

      <p className="mt-6 text-[#86868b] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
        <Loader2 className="h-3 w-3 animate-spin" />
        Processing Business Plan
      </p>
    </div>
  );
};
