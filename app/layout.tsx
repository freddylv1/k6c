import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '小小國語學習家 v3.0 - 兒童國語字典與學習系統',
  description: '專為台灣國小學生設計的中文字、注音、詞語、成語與造句學習系統，支援混合式搜尋、共享知識庫與語音發音。',
  openGraph: {
    title: '小小國語學習家 v3.0 - 兒童國語字典與學習系統',
    description: '專為台灣國小學生設計的中文字、注音、詞語、成語與造句學習系統，支援混合式搜尋、共享知識庫與語音發音。',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '小小國語學習家 v3.0 - 兒童國語字典與學習系統',
    description: '專為台灣國小學生設計的中文字、注音、詞語、成語與造句學習系統，支援混合式搜尋、共享知識庫與語音發音。',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
