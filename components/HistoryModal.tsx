
import React from 'react';
import { HistoryItem } from '../types';
import { X, FileText, Clock, ChevronRight, Trash2 } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onSelect, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-[#F5F5F7]">
          <h3 className="font-semibold text-[#1d1d1f] flex items-center gap-2">
            <Clock className="h-4 w-4" /> 历史分析记录
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-20 text-gray-400 text-sm">暂无历史记录</div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => { onSelect(item); onClose(); }}
                className="group p-4 bg-white border border-gray-100 rounded-2xl hover:border-blue-500/30 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-[#1d1d1f] truncate text-sm">{item.fileName}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                        item.report.executiveSummary.preliminaryVerdict === 'Invest' ? 'bg-green-50 text-green-600 border-green-100' :
                        item.report.executiveSummary.preliminaryVerdict === 'Watch' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-red-50 text-red-600 border-red-100'
                    }`}>
                        {item.report.executiveSummary.preliminaryVerdict}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500" />
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                <button
                    onClick={(e) => {
                        if(confirm('确定清空所有历史记录吗？')) onClear();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-600 hover:bg-red-50 text-sm font-medium transition-colors"
                >
                    <Trash2 className="h-4 w-4" /> 清空记录
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
