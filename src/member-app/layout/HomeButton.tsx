'use client';

import { usePathname } from 'next/navigation';
import { useTransitionOverlay } from './TransitionOverlayContext';

const HOME_COLOR = '#1e3a8a';

export default function HomeButton() {
  const pathname = usePathname();
  const { overlay, trigger } = useTransitionOverlay();
  const isHome = pathname === '/member';

  // ホーム画面自体、または画面遷移の演出中（行き来どちらの向きでも）は表示しない。
  // 遷移先のページはpush直後にもう裏でマウントされているため、
  // 演出中も表示したままだと展開中の円の外側から早見えしてしまう。
  if (isHome || overlay) return null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    trigger(rect.left + rect.width / 2, rect.top + rect.height / 2, HOME_COLOR, '/member');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-blue-900 text-white card-shadow-lg flex items-center justify-center active:scale-95 transition-transform"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
        />
      </svg>
    </button>
  );
}
