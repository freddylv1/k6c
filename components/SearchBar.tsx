import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, forceRefresh: boolean) => void;
  isLoading: boolean;
  currentQuery: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading, currentQuery }) => {
  const [inputVal, setInputVal] = useState(currentQuery);

  const handleSubmit = (e: React.FormEvent, force: boolean = false) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSearch(inputVal.trim(), force);
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-3">
      <div className="relative flex items-center shadow-lg rounded-2xl overflow-hidden bg-white border-2 border-amber-300 focus-within:border-amber-500 transition-colors">
        <div className="pl-5 text-amber-500">
          <Search className="w-6 h-6" />
        </div>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="請輸入國字、詞語或成語（例如：學、勇敢、畫蛇添足）..."
          className="w-full py-4 px-4 text-lg sm:text-xl text-slate-800 placeholder-slate-400 bg-transparent focus:outline-hidden font-sans"
        />
        <div className="flex items-center gap-2 pr-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e as any, true)}
            disabled={isLoading || !inputVal.trim()}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
            title="忽略快取，重新查詢最新資料"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            強制重新查詢
          </button>
          <button
            type="submit"
            disabled={isLoading || !inputVal.trim()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 text-base flex items-center justify-center min-w-[90px]"
          >
            {isLoading ? '查詢中...' : '查字典'}
          </button>
        </div>
      </div>
      
      {/* Mobile force refresh button */}
      <div className="flex sm:hidden justify-end">
        <button
          type="button"
          onClick={(e) => handleSubmit(e as any, true)}
          disabled={isLoading || !inputVal.trim()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          強制重新查詢
        </button>
      </div>

      {/* Quick suggestion tags */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-sm text-slate-600">
        <span className="font-semibold text-slate-500">熱門查詢：</span>
        {['學', '勇敢', '畫蛇添足', '快樂', '老師'].map((word) => (
          <button
            key={word}
            type="button"
            onClick={() => {
              setInputVal(word);
              onSearch(word, false);
            }}
            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-full border border-amber-200 transition-colors text-xs font-semibold"
          >
            {word}
          </button>
        ))}
      </div>
    </form>
  );
};
