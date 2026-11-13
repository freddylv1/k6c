'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2>發生未預期的系統錯誤</h2>
          <button onClick={() => reset()} style={{ marginTop: '16px', padding: '8px 16px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            重新整理
          </button>
        </div>
      </body>
    </html>
  );
}
