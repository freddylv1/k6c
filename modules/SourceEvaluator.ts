import { DataSource } from '@/types/Source';

export const TRUSTED_SOURCES: DataSource[] = [
  {
    id: 'moe_dict',
    sourceName: '教育部國語辭典簡編本 / 修訂本',
    sourceType: 'official_dictionary',
    sourceUrl: 'https://dict.concised.moe.edu.tw/',
    license: '政府資料開放授權條款-第1版',
    attributionRequired: true,
    redistributionAllowed: true,
    modificationAllowed: false,
    contentStorageAllowed: true,
    trustLevel: 'TRUSTED_OFFICIAL',
    enabled: true,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'moedict_api',
    sourceName: '萌典公開 API (moedict.tw)',
    sourceType: 'open_api',
    sourceUrl: 'https://www.moedict.tw/',
    license: 'CC-BY-NC-SA 3.0 / 公開 API 授權',
    attributionRequired: true,
    redistributionAllowed: true,
    modificationAllowed: false,
    contentStorageAllowed: true,
    trustLevel: 'TRUSTED_OPEN_API',
    enabled: true,
    lastCheckedAt: new Date().toISOString(),
  },
  {
    id: 'moe_idiom',
    sourceName: '教育部成語典',
    sourceType: 'official_dictionary',
    sourceUrl: 'https://dict.idioms.moe.edu.tw/',
    license: '政府資料開放授權條款-第1版',
    attributionRequired: true,
    redistributionAllowed: true,
    modificationAllowed: false,
    contentStorageAllowed: true,
    trustLevel: 'TRUSTED_OFFICIAL',
    enabled: true,
    lastCheckedAt: new Date().toISOString(),
  }
];

export class SourceEvaluator {
  static getSource(sourceId: string): DataSource | undefined {
    return TRUSTED_SOURCES.find(s => s.id === sourceId);
  }

  static isTrustedSource(sourceId: string): boolean {
    const source = this.getSource(sourceId);
    return !!source && source.enabled && (source.trustLevel === 'TRUSTED_OFFICIAL' || source.trustLevel === 'TRUSTED_OPEN_API');
  }

  static canStoreContent(sourceId: string): boolean {
    const source = this.getSource(sourceId);
    return !!source && source.enabled && source.contentStorageAllowed;
  }
}
