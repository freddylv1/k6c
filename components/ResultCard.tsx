import React from 'react';
import { KnowledgeEntry } from '@/types/Knowledge';
import { SourceBadge } from '@/components/SourceBadge';
import { VerificationBadge } from '@/components/VerificationBadge';
import { WordList } from '@/components/WordList';
import { SentenceList } from '@/components/SentenceList';
import { SpeechEngine } from '@/modules/SpeechEngine';
import { Volume2 } from 'lucide-react';

interface ResultCardProps {
  entry: KnowledgeEntry;
}

export const ResultCard: React.FC<ResultCardProps> = ({ entry }) => {
  return (
    <div className="space-y-6">
      {/* Badges bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <VerificationBadge status={entry.verificationStatus} />
        <SourceBadge 
          sourceId={entry.sourceId} 
          sourceUrl={entry.sourceUrl} 
          sourceLicense={entry.sourceLicense} 
        />
      </div>

      {/* Definition Section */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-amber-500 rounded-full inline-block"></span>
            辭典解釋
          </h3>
          <button
            onClick={() => SpeechEngine.speak(entry.definition)}
            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
            title="朗讀解釋"
          >
            <Volume2 className="w-4 h-4" />
            朗讀解釋
          </button>
        </div>
        <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-line pl-4 border-l-4 border-amber-300 font-sans">
          {entry.definition}
        </div>
      </div>

      {/* Idiom Origin if present */}
      {entry.idiomOrigin && (
        <div className="bg-amber-50/60 rounded-2xl p-6 sm:p-8 border border-amber-200/60 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-amber-900 flex items-center gap-2">
            <span className="w-2.5 h-6 bg-amber-600 rounded-full inline-block"></span>
            成語典故與出處
          </h3>
          <div className="text-slate-700 text-base leading-relaxed pl-4 border-l-4 border-amber-400">
            {entry.idiomOrigin}
          </div>
        </div>
      )}

      {/* Word Combinations if present */}
      {entry.wordCombinations && entry.wordCombinations.length > 0 && (
        <WordList combinations={entry.wordCombinations} />
      )}

      {/* Example Sentences if present */}
      {entry.exampleSentences && entry.exampleSentences.length > 0 && (
        <SentenceList sentences={entry.exampleSentences} />
      )}
    </div>
  );
};
