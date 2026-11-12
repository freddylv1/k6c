import React from 'react';
import { ShieldCheck, AlertTriangle, Clock } from 'lucide-react';
import { VerificationStatus } from '../types/Knowledge';

interface VerificationBadgeProps {
  status: VerificationStatus;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ status }) => {
  switch (status) {
    case 'VERIFIED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          已驗證資料
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          資料待確認
        </span>
      );
    case 'FAILED':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-xs font-semibold border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          驗證未通過
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200">
          外部網站查詢
        </span>
      );
  }
};
