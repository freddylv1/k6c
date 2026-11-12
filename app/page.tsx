'use client';

import React, { useState, useCallback } from 'react';
import { SearchBar } from '@/components/SearchBar';
import { PronunciationCard } from '@/components/PronunciationCard';
import { ResultCard } from '@/components/ResultCard';
import { ExternalSearchPanel } from '@/components/ExternalSearchPanel';
import { RefreshComparison } from '@/components/RefreshComparison';
import { LearningHistory } from '@/components/LearningHistory';
import { SearchEngine } from '@/modules/SearchEngine';
import { CacheEngine } from '@/modules/CacheEngine';
import { SearchResult } from '@/types/Search';
import { KnowledgeEntry } from '@/types/Knowledge';
import { GraduationCap, ShieldCheck } from 'lucide-react';

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>(() => (typeof window !== 'undefined' ? CacheEngine.getHistory() : []));
  const [favorites, setFavorites] = useState<KnowledgeEntry[]>(() => (typeof window !== 'undefined' ? CacheEngine.getFavorites() : []));
  const [isFav, setIsFav] = useState<boolean>(false);
  const [refreshComparisonData, setRefreshComparisonData] = useState<{ oldEntry?: KnowledgeEntry; newEntry?: KnowledgeEntry } | null>(null);

  const handleSearch = useCallback(async (query: string, forceRefresh: boolean) => {
    setIsLoading(true);
    setRefreshComparisonData(null);
    const oldEntry = searchResult?.entry;

    const res = await SearchEngine.search(query, forceRefresh);
    setSearchResult(res);
    setHistory(CacheEngine.getHistory());

    if (res.entry) {
      setIsFav(CacheEngine.isFavorite(res.entry.normalizedQuery));
      if (forceRefresh) {
        setRefreshComparisonData({
          oldEntry,
          newEntry: res.entry,
        });
      }
    } else {
      setIsFav(false);
    }

    setIsLoading(false);
  }, [searchResult?.entry]);

  const handleToggleFavorite = () => {
    if (!searchResult?.entry) return;
    const added = CacheEngine.toggleFavorite(searchResult.entry);
    setIsFav(added);
    setFavorites(CacheEngine.getFavorites());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 via-orange-50/20 to-slate-50 text-slate-800 pb-16">
      {/* Header */}
      <header className="bg-white/85 backdrop-blur-md sticky top-0 z-30 border-b border-amber-100 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                小小國語學習家
                <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">v3.0</span>
              </h1>
              <p className="text-xs text-slate-500">專為國小學生設計的智慧字典與混合查詢系統</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            教育部公開資料授權
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 sm:pt-10 space-y-8">
        {/* Hero Search Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200/60 shadow-lg space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-wide">
              今天想查哪個字或詞語呢？
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              支援單字、詞語、成語查詢，附有注音、解釋、造詞與真人發音！
            </p>
          </div>

          <SearchBar 
            onSearch={handleSearch} 
            isLoading={isLoading} 
            currentQuery={searchResult?.query || ''} 
          />
        </div>

        {/* Refresh Comparison Modal if triggered */}
        {refreshComparisonData && (
          <RefreshComparison
            oldEntry={refreshComparisonData.oldEntry}
            newEntry={refreshComparisonData.newEntry}
            onClose={() => setRefreshComparisonData(null)}
          />
        )}

        {/* Search Result Section */}
        {searchResult ? (
          <div className="space-y-6">
            {searchResult.found && searchResult.entry ? (
              <>
                <PronunciationCard
                  entry={searchResult.entry}
                  isFav={isFav}
                  onToggleFavorite={handleToggleFavorite}
                />
                <ResultCard entry={searchResult.entry} />
              </>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  🔍
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  查無「{searchResult.query}」的直接辭典收錄
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  本機與公開資料庫中暫未收錄此詞語。您可以透過下方的外部官方網站與搜尋引擎繼續尋找答案。
                </p>
              </div>
            )}

            {/* External Search Links Panel */}
            <ExternalSearchPanel links={searchResult.externalLinks} query={searchResult.query} />
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 shadow-sm text-center space-y-3">
            <div className="text-4xl">📖</div>
            <h3 className="text-lg font-bold text-slate-700">準備好開始探索國語文世界了嗎？</h3>
            <p className="text-sm text-slate-500">請在上方搜尋框輸入您想查詢的國字、詞語或成語（例如：天、水、貓、快樂）。</p>
          </div>
        )}

        {/* Learning History & Favorites */}
        <LearningHistory
          history={history}
          favorites={favorites}
          onSelectQuery={(q) => handleSearch(q, false)}
          onSelectFavorite={(fav) => {
            setSearchResult({
              query: fav.title,
              normalizedQuery: fav.normalizedQuery,
              found: true,
              searchMode: 'L1_CACHE',
              entry: fav,
              externalLinks: SearchEngine.generateExternalLinks(fav.title),
              verificationStatus: fav.verificationStatus,
              message: '從收藏載入',
              timestamp: new Date().toISOString(),
            });
            setIsFav(true);
          }}
        />
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 pt-16 text-center text-xs text-slate-400 space-y-2">
        <p>小小國語學習家 (Little Mandarin Learning System) v3.0 | 混合式檢索與共享知識庫系統</p>
        <p>資料來源採用教育部公開辭典與萌典公開專案，遵守政府資料開放授權條款。</p>
      </footer>
    </div>
  );
}
