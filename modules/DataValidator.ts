import { KnowledgeEntry, VerificationStatus } from '@/types/Knowledge';
import { SourceEvaluator } from './SourceEvaluator';

export class DataValidator {
  static validateEntry(entry: Partial<KnowledgeEntry>): { isValid: boolean; errors: string[]; status: VerificationStatus } {
    const errors: string[] = [];

    if (!entry.title || entry.title.trim() === '') {
      errors.push('缺少標題字詞');
    }

    if (!entry.pronunciation || entry.pronunciation.trim() === '') {
      errors.push('缺少注音資訊');
    }

    if (!entry.definition || entry.definition.trim() === '') {
      errors.push('缺少釋義內容');
    }

    if (!entry.sourceId || !SourceEvaluator.getSource(entry.sourceId)) {
      errors.push('缺少有效或已授權的資料來源');
    }

    const isTrusted = entry.sourceId ? SourceEvaluator.isTrustedSource(entry.sourceId) : false;
    const canStore = entry.sourceId ? SourceEvaluator.canStoreContent(entry.sourceId) : false;

    let status: VerificationStatus = 'UNVERIFIED';

    if (errors.length === 0) {
      if (isTrusted && canStore) {
        status = 'VERIFIED';
      } else {
        status = 'PENDING';
      }
    } else {
      status = 'FAILED';
    }

    return {
      isValid: errors.length === 0 && (status === 'VERIFIED' || status === 'PENDING'),
      errors,
      status,
    };
  }
}
