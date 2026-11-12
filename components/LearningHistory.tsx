import React from 'react';
import { History, Bookmark } from 'lucide-react';
import { KnowledgeEntry } from '@/types/Knowledge';

interface LearningHistoryProps {
  history: string[];
  favorites: KnowledgeEntry[];
  onSelectQuery: (q: string) => void;
  onSelectFavorite: (entry: KnowledgeEntry) => void;
}

export const LearningHistory: React.FC<LearningHistoryProps> = ({
  history,
  favorites,
  onSelectQuery,
  onSelectFavorite,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Search History */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <History className="w-4 h-4 text-amber-600" />
          最近查詢紀錄
        </h3>
        {history.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">尚無查詢紀錄</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => (
              <button
                key={idx}
                onClick={() => onSelectQuery(item)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-800 rounded-lg text-sm border border-slate-200 transition-colors font-medium"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Favorites */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-600" />
          我的收藏詞語 ({favorites.length})
        </h3>
        {favorites.length === 0 ? (
          <p className="text-sm text-slate-400 py-4 text-center">尚未收藏任何字詞</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {favorites.map((fav, idx) => (
              <button
                key={idx}
                onClick={() => onSelectFavorite(fav)}
                className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-sm border border-amber-200 transition-colors font-bold flex items-center gap-1.5"
              >
                <span>{fav.title}</span>
                <span className="text-xs font-mono font-normal text-amber-700">({fav.pronunciation})</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
