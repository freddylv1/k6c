import { KnowledgeEntry } from '@/types/Knowledge';

const CACHE_PREFIX = 'little_mandarin_cache_v3_';
const HISTORY_KEY = 'little_mandarin_history_v3';
const FAVORITES_KEY = 'little_mandarin_favorites_v3';

export class CacheEngine {
  static getCachedEntry(normalizedQuery: string): KnowledgeEntry | null {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(CACHE_PREFIX + normalizedQuery);
      if (!item) return null;
      return JSON.parse(item);
    } catch (e) {
      return null;
    }
  }

  static setCachedEntry(entry: KnowledgeEntry): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CACHE_PREFIX + entry.normalizedQuery, JSON.stringify(entry));
    } catch (e) {
      console.error(e);
    }
  }

  static getHistory(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const item = localStorage.getItem(HISTORY_KEY);
      return item ? JSON.parse(item) : [];
    } catch (e) {
      return [];
    }
  }

  static addHistory(query: string): void {
    if (typeof window === 'undefined') return;
    try {
      let history = CacheEngine.getHistory();
      history = [query, ...history.filter(q => q !== query)].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.error(e);
    }
  }

  static getFavorites(): KnowledgeEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const item = localStorage.getItem(FAVORITES_KEY);
      return item ? JSON.parse(item) : [];
    } catch (e) {
      return [];
    }
  }

  static toggleFavorite(entry: KnowledgeEntry): boolean {
    if (typeof window === 'undefined') return false;
    try {
      let favs = CacheEngine.getFavorites();
      const exists = favs.some(f => f.normalizedQuery === entry.normalizedQuery);
      if (exists) {
        favs = favs.filter(f => f.normalizedQuery !== entry.normalizedQuery);
      } else {
        favs = [entry, ...favs];
      }
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
      return !exists;
    } catch (e) {
      return false;
    }
  }

  static isFavorite(normalizedQuery: string): boolean {
    const favs = CacheEngine.getFavorites();
    return favs.some(f => f.normalizedQuery === normalizedQuery);
  }
}
