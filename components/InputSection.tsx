import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Search } from 'lucide-react';

interface InputSectionProps {
  onAnalyze: (file: File) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onAnalyze, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  };

  const handleAnalyzeClick = () => {
    if (file) {
      onAnalyze(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center">
            <Search className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">投资尽职调查</h2>
        <p className="text-slate-500 max-w-lg mx-auto">
          请在下方上传您的商业计划书（PDF）。
          我们的 AI 合伙人将进行严格的 VC 级可视化分析。
        </p>

        <div 
          className="relative border-2 border-dashed border-slate-300 rounded-xl p-12 hover:bg-slate-50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
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
                <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                   <FileText className="h-8 w-8 text-emerald-600" />
                </div>
             ) : (
                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                   <UploadCloud className="h-8 w-8 text-slate-400" />
                </div>
             )}
             
             <div>
               <p className="text-lg font-semibold text-slate-700">
                 {file ? file.name : "点击或拖拽上传商业计划书 (PDF)"}
               </p>
               {!file && (
                 <p className="text-sm text-slate-400 mt-1">支持格式: PDF</p>
               )}
             </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleAnalyzeClick}
            disabled={isLoading || !file}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-full text-white font-semibold text-lg transition-all
              ${isLoading || !file 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1'
              }
            `}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                正在分析文档...
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                生成投资备忘录
              </>
            )}
          </button>
        </div>
        
        <p className="text-xs text-slate-400 mt-4">
          技术支持: Gemini 3 Flash • VC Framework v2.0
        </p>
      </div>
    </div>
  );
};