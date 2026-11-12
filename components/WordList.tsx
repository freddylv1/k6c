import React from 'react';
import { WordCombination } from '@/types/Knowledge';
import { Volume2 } from 'lucide-react';
import { SpeechEngine } from '@/modules/SpeechEngine';

interface WordListProps {
  combinations: WordCombination[];
}

export const WordList: React.FC<WordListProps> = ({ combinations }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
        相關造詞與詞語
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {combinations.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-50 hover:bg-emerald-50/40 rounded-xl border border-slate-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl font-bold text-slate-800">{item.word}</span>
                <button
                  onClick={() => SpeechEngine.speak(item.word)}
                  className="p-1.5 text-emerald-700 hover:bg-emerald-100 rounded-full transition-colors"
                  title="朗讀詞語"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
              <div className="text-sm font-mono text-emerald-800 mb-1">{item.pronunciation}</div>
              <p className="text-sm text-slate-600 leading-relaxed">{item.definition}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
