import { KnowledgeEntry } from '@/types/Knowledge';
import { generateContentHash } from '@/utils/hash';
import { normalizeQuery } from '@/utils/normalizeQuery';

export class PublicDictionaryService {
  static async fetchEntry(query: string): Promise<KnowledgeEntry | null> {
    const raw = query?.trim();
    if (!raw) return null;
    const norm = normalizeQuery(raw);

    try {
      // Query Moedict public API in real-time
      const res = await fetch(`https://www.moedict.tw/a/${encodeURIComponent(raw)}.json`, {
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        const json = await res.json();
        if (json && (json.title || json.heteronyms)) {
          const title = json.title || raw;
          const heteronym = json.heteronyms?.[0] || {};
          const defs = heteronym.definitions?.map((d: any, idx: number) => `${idx + 1}. ${d.def}`).join('\n') || json.explanation || '查無詳細定義。';
          const bopo = heteronym.bopomofo || '注音待確認';
          const pinyin = heteronym.pinyin || '';
          const now = new Date().toISOString();

          // Extract example sentences if available in definitions
          const exampleSentences: { sentence: string; sourceType: 'dictionary' | 'system_practice' }[] = [];
          if (heteronym.definitions) {
            for (const d of heteronym.definitions) {
              if (d.example && Array.isArray(d.example)) {
                for (const ex of d.example) {
                  exampleSentences.push({ sentence: ex, sourceType: 'dictionary' });
                }
              }
            }
          }

          if (exampleSentences.length === 0) {
            exampleSentences.push({ sentence: `這是關於「${title}」的公開字典說明例句。`, sourceType: 'system_practice' });
          }

          const entry: KnowledgeEntry = {
            id: `moedict_${norm}_${Date.now()}`,
            normalizedQuery: norm,
            entryType: title.length > 3 ? 'idiom' : title.length > 1 ? 'word' : 'character',
            title,
            pronunciation: bopo,
            bopomofo: bopo,
            pinyin,
            definition: defs,
            wordCombinations: [],
            idiomOrigin: json.idiom_origin || undefined,
            exampleSentences,
            difficultyLevel: title.length > 3 ? 'L3' : 'L1',
            sourceId: 'moedict_api',
            sourceUrl: `https://www.moedict.tw/${encodeURIComponent(title)}`,
            sourceLicense: 'CC-BY-NC-SA 3.0 / 萌典公開 API',
            verificationStatus: 'VERIFIED',
            contentHash: generateContentHash(title + defs),
            version: 1,
            createdAt: now,
            updatedAt: now,
            lastCheckedAt: now,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          };
          return entry;
        }
      }
    } catch (e) {
      console.warn('Moedict live fetch error:', e);
    }

    return null;
  }
}
