import React from 'react';
import { ExternalSearchLink } from '@/types/Search';
import { ExternalLink, Globe, BookMarked, Search } from 'lucide-react';

interface ExternalSearchPanelProps {
  links: ExternalSearchLink[];
  query: string;
}

export const ExternalSearchPanel: React.FC<ExternalSearchPanelProps> = ({ links, query }) => {
  return (
    <div className="bg-sky-50/80 rounded-2xl p-6 sm:p-8 border border-sky-200 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-5 h-5 text-sky-600" />
        <h3 className="text-lg font-bold text-sky-900">外部網站與官方辭典查詢入口</h3>
      </div>
      <p className="text-sm text-sky-700">
        針對「<span className="font-semibold">{query}</span>」，您可透過以下官方網站與線上辭典進行深入查詢：
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 bg-white hover:bg-sky-100/60 rounded-xl border border-sky-200 transition-all shadow-xs flex items-start justify-between group"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-sky-900 font-bold group-hover:text-sky-700">
                {link.category === 'official' ? <BookMarked className="w-4 h-4 text-emerald-600" /> : <Search className="w-4 h-4 text-sky-600" />}
                <span>{link.siteName}</span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{link.description}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-sky-400 group-hover:text-sky-700 shrink-0 mt-1" />
          </a>
        ))}
      </div>
    </div>
  );
};
