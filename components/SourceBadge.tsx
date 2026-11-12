import React from 'react';
import { BookOpen } from 'lucide-react';
import { SourceEvaluator } from '@/modules/SourceEvaluator';

interface SourceBadgeProps {
  sourceId: string;
  sourceUrl?: string;
  sourceLicense: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceId, sourceUrl, sourceLicense }) => {
  const source = SourceEvaluator.getSource(sourceId);
  const sourceName = source ? source.sourceName : sourceId;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-800 rounded-full text-xs font-medium border border-sky-200">
      <BookOpen className="w-3.5 h-3.5 text-sky-600" />
      <span>來源：</span>
      {sourceUrl ? (
        <a 
          href={sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline hover:text-sky-900 font-semibold"
          title={`授權：${sourceLicense}`}
        >
          {sourceName}
        </a>
      ) : (
        <span>{sourceName}</span>
      )}
    </div>
  );
};
