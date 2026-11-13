'use client';

import React from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 text-slate-800 p-4">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold mb-2">系統發生了一點小狀況</h2>
      <p className="text-slate-600 mb-6">{error.message || '請重新整理頁面再試一次。'}</p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl shadow hover:bg-amber-600 transition-colors"
      >
        重新整理
      </button>
    </div>
  );
}
