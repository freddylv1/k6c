import React from 'react';
import { Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import { SpeechEngine } from '@/modules/SpeechEngine';
import { KnowledgeEntry } from '@/types/Knowledge';

interface PronunciationCardProps {
  entry: KnowledgeEntry;
  isFav: boolean;
  onToggleFavorite: () => void;
}

export const PronunciationCard: React.FC<PronunciationCardProps> = ({ entry, isFav, onToggleFavorite }) => {
  const handleSpeakWord = () => {
    SpeechEngine.speak(entry.title);
  };

  const handleSpeakPronunciation = () => {
    SpeechEngine.speak(entry.pronunciation);
  };

  return (
    <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 rounded-2xl p-6 border border-amber-200/60 shadow-sm relative overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={onToggleFavorite}
          className={`p-2 rounded-full transition-colors ${
            isFav 
              ? 'bg-amber-500 text-white shadow-sm' 
              : 'bg-white/80 text-slate-600 hover:bg-amber-100 hover:text-amber-800 border border-amber-200'
          }`}
          title={isFav ? '已加入收藏' : '加入收藏'}
        >
          {isFav ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-800 tracking-wide font-sans">
            {entry.title}
          </h2>
          <button
            onClick={handleSpeakWord}
            className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow transition-transform active:scale-95 flex items-center justify-center"
            title="朗讀字詞"
          >
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-2 bg-white/90 px-4 py-2 rounded-xl border border-amber-200 shadow-xs">
          <span className="text-lg sm:text-xl font-bold text-amber-800 font-mono tracking-wider">
            {entry.pronunciation}
          </span>
          <button
            onClick={handleSpeakPronunciation}
            className="p-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-full transition-colors"
            title="朗讀注音"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="px-2.5 py-0.5 bg-white/70 rounded-md border border-amber-200/50">
          類型：{entry.entryType === 'character' ? '國字' : entry.entryType === 'idiom' ? '成語' : '詞語'}
        </span>
        <span className="px-2.5 py-0.5 bg-white/70 rounded-md border border-amber-200/50">
          建議年級：{entry.difficultyLevel === 'L1' ? '國小一、二年級' : entry.difficultyLevel === 'L2' ? '國小三、四年級' : entry.difficultyLevel === 'L3' ? '國小五、六年級' : '進階學習'}
        </span>
      </div>
    </div>
  );
};
