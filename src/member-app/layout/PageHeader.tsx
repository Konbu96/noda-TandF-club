'use client';

import { usePathname, useRouter } from 'next/navigation';

type Entry = {
  match: (path: string) => boolean;
  title: (path: string) => string;
  back?: (path: string) => string;
};

const ENTRIES: Entry[] = [
  { match: (p) => p === '/member/mypage', title: () => 'マイページ' },
  { match: (p) => p === '/member/competition', title: () => '大会' },
  { match: (p) => p === '/member/menu', title: () => 'メニュー' },
  { match: (p) => p === '/member/menu/practice-time', title: () => 'タイム記録', back: () => '/member/menu' },
  {
    match: (p) => /^\/member\/menu\/[^/]+$/.test(p) && p !== '/member/menu/create' && p !== '/member/menu/practice-time',
    title: (p) => `${p.split('/').pop()!.replace(/-/g, '/')} のメニュー`,
    back: () => '/member/menu',
  },
];

export default function PageHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const entry = ENTRIES.find((e) => e.match(pathname));
  if (!entry) return null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-20 h-12 bg-blue-900 px-4 flex items-center gap-2">
        {entry.back && (
          <button
            type="button"
            onClick={() => router.push(entry.back!(pathname))}
            aria-label="戻る"
            className="-ml-1 p-1 text-white shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <p className="text-sm font-bold text-white truncate">{entry.title(pathname)}</p>
      </div>
      {/* ヘッダーがfixedで浮いている分、以降のコンテンツが隠れないように同じ高さの余白を確保する */}
      <div className="h-12" aria-hidden="true" />
    </>
  );
}
