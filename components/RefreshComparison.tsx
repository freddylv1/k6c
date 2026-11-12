import React from 'react';
import { KnowledgeEntry } from '@/types/Knowledge';
import { RefreshCw, CheckCircle2 } from 'lucide-react';

interface RefreshComparisonProps {
  oldEntry?: KnowledgeEntry;
  newEntry?: KnowledgeEntry;
  onClose: () => void;
}

export const RefreshComparison: React.FC<RefreshComparisonProps> = ({ oldEntry, newEntry, onClose }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-amber-300 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
          強制重新查詢結果比較
        </h3>
        <button
          onClick={onClose}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800 px-3 py-1 bg-slate-100 rounded-lg"
        >
          關閉比對
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Old Data */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase">原快取資料</div>
          <div className="text-lg font-bold text-slate-800">{oldEntry ? oldEntry.title : '無舊資料'}</div>
          <div className="text-sm text-slate-600">注音：{oldEntry?.pronunciation || 'N/A'}</div>
          <div className="text-sm text-slate-600 line-clamp-3">解釋：{oldEntry?.definition || 'N/A'}</div>
          <div className="text-xs text-slate-400">來源：{oldEntry?.sourceId || 'N/A'}</div>
        </div>

        {/* New Data */}
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-2">
          <div className="text-xs font-bold text-amber-700 uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            新查詢資料
          </div>
          <div className="text-lg font-bold text-slate-800">{newEntry ? newEntry.title : '無新資料'}</div>
          <div className="text-sm text-amber-900 font-mono">注音：{newEntry?.pronunciation || 'N/A'}</div>
          <div className="text-sm text-slate-700 line-clamp-3">解釋：{newEntry?.definition || 'N/A'}</div>
          <div className="text-xs text-amber-600">來源：{newEntry?.sourceId || 'N/A'}</div>
        </div>
      </div>
    </div>
  );
};
