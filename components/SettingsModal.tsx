
import React, { useState } from 'react';
import { ApiSettings, DEFAULT_SETTINGS } from '../types';
import { X, Save, RotateCcw, Key } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ApiSettings;
  onSave: (newSettings: ApiSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<ApiSettings>(settings);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-[#F5F5F7]">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-[#1d1d1f]" />
            <h3 className="font-semibold text-[#1d1d1f]">API 模型设置</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              推理模型 API Key
            </label>
            <input 
              type="password" 
              value={localSettings.deepSeekKey}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, deepSeekKey: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-mono text-gray-800"
              placeholder="sk-..."
            />
            <p className="mt-2 text-[11px] text-gray-400">用于核心逻辑分析与报告生成</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              联网搜索 API Key
            </label>
            <input 
              type="password" 
              value={localSettings.tavilyKey}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, tavilyKey: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-mono text-gray-800"
              placeholder="tvly-..."
            />
             <p className="mt-2 text-[11px] text-gray-400">用于实时市场数据搜索增强</p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
          <button 
            onClick={handleReset}
            className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" /> 恢复默认
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2.5 rounded-full bg-[#1d1d1f] text-white text-sm font-medium hover:bg-black transition-transform active:scale-95 flex items-center gap-2"
            >
              <Save className="h-4 w-4" /> 保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
