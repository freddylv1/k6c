export type VerificationStatus = 'VERIFIED' | 'PENDING' | 'UNVERIFIED' | 'FAILED';

export type EntryType = 'character' | 'word' | 'idiom' | 'sentence';

export type DifficultyLevel = 'L1' | 'L2' | 'L3' | 'L4'; // L1: 1-2年級, L2: 3-4年級, L3: 5-6年級, L4: 進階

export interface WordCombination {
  word: string;
  pronunciation: string;
  definition: string;
  difficulty?: DifficultyLevel;
}

export interface ExampleSentence {
  sentence: string;
  sourceType: 'dictionary' | 'system_practice';
  note?: string;
}

export interface KnowledgeEntry {
  id: string;
  normalizedQuery: string;
  entryType: EntryType;
  title: string;
  pronunciation: string; // 注音
  bopomofo?: string;
  pinyin?: string;
  definition: string;
  wordCombinations?: WordCombination[];
  idiomOrigin?: string; // 成語典故
  exampleSentences?: ExampleSentence[];
  difficultyLevel?: DifficultyLevel;
  sourceId: string;
  sourceUrl?: string;
  sourceLicense: string;
  verificationStatus: VerificationStatus;
  contentHash: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  lastCheckedAt: string;
  expiresAt: string;
}

export interface CandidateEntry {
  id: string;
  normalizedQuery: string;
  rawData: any;
  parsedData: any;
  sourceId: string;
  sourceUrl?: string;
  sourceLicense: string;
  validationErrors?: string[];
  verificationStatus: VerificationStatus;
  contentHash: string;
  createdAt: string;
  updatedAt: string;
}
