import { KnowledgeEntry, VerificationStatus } from './Knowledge';

export type SearchMode = 'L1_CACHE' | 'L2_SHARED_VERIFIED' | 'L2_SHARED_PENDING' | 'L3_PUBLIC_API' | 'EXTERNAL_ONLY' | 'NOT_FOUND';

export interface ExternalSearchLink {
  siteName: string;
  url: string;
  category: 'official' | 'search_engine' | 'dictionary';
  description: string;
}

export interface SearchResult {
  query: string;
  normalizedQuery: string;
  found: boolean;
  searchMode: SearchMode;
  entry?: KnowledgeEntry;
  externalLinks: ExternalSearchLink[];
  verificationStatus: VerificationStatus;
  message: string;
  timestamp: string;
}

export interface RefreshComparisonResult {
  query: string;
  oldEntry?: KnowledgeEntry;
  newEntry?: KnowledgeEntry;
  statusChanged: boolean;
  diffSummary: string;
  timestamp: string;
}
