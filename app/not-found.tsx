'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber-50 text-slate-800 p-4">
      <div className="text-6xl mb-4">📖</div>
      <h2 className="text-2xl font-bold mb-2">找不到這個頁面</h2>
      <p className="text-slate-600 mb-6">您造訪的網頁不存在，請返回首頁繼續查詢字典。</p>
      <Link href="/" className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl shadow hover:bg-amber-600 transition-colors">
        返回首頁
      </Link>
    </div>
  );
}
