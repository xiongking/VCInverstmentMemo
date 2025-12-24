
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, ArrowRight } from 'lucide-react';

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

  const handleAnalyzeClick = () => {
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center space-y-8">
        
        <div 
          className={`
            relative border border-dashed rounded-lg p-16 transition-all duration-200 cursor-pointer
            ${isDragging 
              ? 'border-slate-900 bg-slate-50' 
              : file 
                ? 'border-slate-300 bg-slate-50/50' 
                : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isLoading}
          />
          
          <div className="flex flex-col items-center justify-center space-y-4">
             {file ? (
                <>
                  <div className="h-16 w-16 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                     <FileText className="h-8 w-8 text-slate-700" strokeWidth={1.5} />
                  </div>
                  <div>
                     <p className="text-lg font-medium text-slate-900">
                       {file.name}
                     </p>
                     <p className="text-sm text-slate-500 mt-1">准备就绪</p>
                  </div>
                </>
             ) : (
                <>
                  <div className="h-16 w-16 bg-white border border-slate-200 rounded-full flex items-center justify-center">
                     <UploadCloud className="h-8 w-8 text-slate-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-slate-900 mb-1">
                      点击或拖拽 PDF 文件
                    </p>
                    <p className="text-sm text-slate-400">
                      支持 PDF 格式商业计划书
                    </p>
                  </div>
                </>
             )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAnalyzeClick}
            disabled={isLoading || !file}
            className={`
              flex items-center gap-3 px-12 py-3.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isLoading || !file 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-slate-900 text-white hover:bg-black hover:-translate-y-0.5 shadow-sm'
              }
            `}
          >
            <span>生成投资备忘录</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
