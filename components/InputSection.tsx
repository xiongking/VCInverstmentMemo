
import React, { useState, useRef } from 'react';
import { Upload, FileText, ArrowRight, ArrowUpCircle } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert("请上传有效的 PDF 文件。");
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        alert("请上传有效的 PDF 文件。");
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <div 
        className={`
          group relative bg-white rounded-[32px] p-10 md:p-14 text-center transition-all duration-300
          shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]
          ${isDragging ? 'scale-[1.02] ring-4 ring-blue-100' : 'hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.08)]'}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          accept=".pdf" 
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isLoading}
        />
        
        <div className="flex flex-col items-center justify-center relative z-10">
           {file ? (
              <div className="animate-in fade-in zoom-in duration-300">
                <div className="h-24 w-24 bg-[#F5F5F7] rounded-3xl flex items-center justify-center mb-6 mx-auto">
                   <FileText className="h-10 w-10 text-[#1d1d1f]" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-2 max-w-xs mx-auto truncate">
                   {file.name}
                </h3>
                <p className="text-[#86868b] text-base mb-8">准备就绪</p>
                
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="px-6 py-3 rounded-full bg-[#F5F5F7] text-[#1d1d1f] font-medium hover:bg-[#E8E8ED] transition-colors"
                  >
                    更换
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onAnalyze(file); }}
                    disabled={isLoading}
                    className="px-8 py-3 rounded-full bg-[#1d1d1f] text-white font-medium hover:bg-black transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    开始分析 <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
           ) : (
              <div className="cursor-pointer">
                <div className="mb-6 flex justify-center">
                   <div className="h-20 w-20 rounded-full bg-[#0071e3] flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      <ArrowUpCircle className="h-10 w-10 text-white" strokeWidth={1.5} />
                   </div>
                </div>
                <h2 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
                  点击或拖拽 PDF
                </h2>
                <p className="text-[#86868b] text-lg font-normal">
                  最大支持 20MB
                </p>
              </div>
           )}
        </div>
      </div>
    </div>
  );
};
