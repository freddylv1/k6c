import { SearchResult, ExternalSearchLink } from '@/types/Search';
import { normalizeQuery } from '@/utils/normalizeQuery';
import { CacheEngine } from '@/modules/CacheEngine';
import { PublicDictionaryService } from '@/services/PublicDictionaryService';

export class SearchEngine {
  static async search(query: string, forceRefresh: boolean = false): Promise<SearchResult> {
    const raw = query?.trim() || '';
    if (!raw) {
      return {
        query: '',
        normalizedQuery: '',
        found: false,
        searchMode: 'NOT_FOUND',
        externalLinks: [],
        verificationStatus: 'UNVERIFIED',
        message: '請輸入要查詢的國字、詞語或成語。',
        timestamp: new Date().toISOString(),
      };
    }

    const norm = normalizeQuery(raw);
    const externalLinks = SearchEngine.generateExternalLinks(raw);

    if (!forceRefresh) {
      const cached = CacheEngine.getCachedEntry(norm);
      if (cached) {
        CacheEngine.addHistory(raw);
        return {
          query: raw,
          normalizedQuery: norm,
          found: true,
          searchMode: 'L1_CACHE',
          entry: cached,
          externalLinks,
          verificationStatus: cached.verificationStatus,
          message: '從個人快取載入成功',
          timestamp: new Date().toISOString(),
        };
      }
    }

    const fetched = await PublicDictionaryService.fetchEntry(raw);
    if (fetched) {
      CacheEngine.setCachedEntry(fetched);
      CacheEngine.addHistory(raw);
      return {
        query: raw,
        normalizedQuery: norm,
        found: true,
        searchMode: 'L3_PUBLIC_API',
        entry: fetched,
        externalLinks,
        verificationStatus: fetched.verificationStatus,
        message: forceRefresh ? '強制重新查詢成功取得最新資料' : '成功從公開資料庫取得資料',
        timestamp: new Date().toISOString(),
      };
    }

    CacheEngine.addHistory(raw);
    return {
      query: raw,
      normalizedQuery: norm,
      found: false,
      searchMode: 'EXTERNAL_ONLY',
      externalLinks,
      verificationStatus: 'UNVERIFIED',
      message: '本機與公開辭典查無直接收錄，請使用下方外部網站查詢。',
      timestamp: new Date().toISOString(),
    };
  }

  static generateExternalLinks(query: string): ExternalSearchLink[] {
    const encoded = encodeURIComponent(query);
    return [
      {
        siteName: '教育部重編國語辭典修訂本',
        url: `https://dict.revised.moe.edu.tw/search.jsp?word=${encoded}`,
        category: 'official',
        description: '教育部官方重編國語辭典，提供最完整的字義與典故。'
      },
      {
        siteName: '教育部國語辭典簡編本',
        url: `https://dict.concised.moe.edu.tw/search.jsp?word=${encoded}`,
        category: 'official',
        description: '適合國小學生查詢的簡編版辭典。'
      },
      {
        siteName: '教育部成語典',
        url: `https://dict.idioms.moe.edu.tw/idiomsearch.jsp?word=${encoded}`,
        category: 'official',
        description: '查詢成語由來、出處及用法。'
      },
      {
        siteName: '萌典線上辭典',
        url: `https://www.moedict.tw/#/${encoded}`,
        category: 'dictionary',
        description: '整合重編本、簡編本與兩岸辭典的線上查詢工具。'
      },
      {
        siteName: 'Google 搜尋',
        url: `https://www.google.com/search?q=${encoded}+造詞+解釋+注音`,
        category: 'search_engine',
        description: '透過 Google 搜尋更多相關學習資料。'
      }
    ];
  }
}
