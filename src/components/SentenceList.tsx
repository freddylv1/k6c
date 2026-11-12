import React from 'react';
import { ExampleSentence } from '../types/Knowledge';
import { Volume2, Sparkles } from 'lucide-react';
import { SpeechEngine } from '../modules/SpeechEngine';

interface SentenceListProps {
  sentences: ExampleSentence[];
}

export const SentenceList: React.FC<SentenceListProps> = ({ sentences }) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <span className="w-2.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
        造句與學習例句
      </h3>
      <div className="space-y-3">
        {sentences.map((item, idx) => (
          <div key={idx} className="p-4 bg-slate-50 hover:bg-indigo-50/30 rounded-xl border border-slate-200 transition-colors flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-base text-slate-800 font-medium leading-relaxed">{item.sentence}</p>
              {item.sourceType === 'system_practice' && (
                <span className="inline-flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md font-medium">
                  <Sparkles className="w-3 h-3" />
                  句型練習示範，非辭典原文
                </span>
              )}
            </div>
            <button
              onClick={() => SpeechEngine.speak(item.sentence)}
              className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors shrink-0"
              title="朗讀例句"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
