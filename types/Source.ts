export type TrustLevel = 'TRUSTED_OFFICIAL' | 'TRUSTED_OPEN_API' | 'PUBLIC_SOURCE' | 'UNKNOWN_SOURCE';

export type SourceType = 'official_dictionary' | 'open_api' | 'external_search' | 'user_imported';

export interface DataSource {
  id: string;
  sourceName: string;
  sourceType: SourceType;
  sourceUrl: string;
  apiEndpoint?: string;
  license: string;
  attributionRequired: boolean;
  redistributionAllowed: boolean;
  modificationAllowed: boolean;
  contentStorageAllowed: boolean;
  trustLevel: TrustLevel;
  enabled: boolean;
  lastCheckedAt: string;
}

export interface QueryStatistic {
  normalizedQuery: string;
  queryCount: number;
  cacheHitCount: number;
  apiHitCount: number;
  externalSearchCount: number;
  lastQueriedAt: string;
}

export interface DataVersionRecord {
  id: string;
  entryId: string;
  oldVersion: number;
  newVersion: number;
  changeReason: string;
  sourceId: string;
  createdAt: string;
}
