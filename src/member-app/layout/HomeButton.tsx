'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useTransitionOverlay } from './TransitionOverlayContext';
import { NAV_ITEMS } from './navItems';

export default function HomeButton() {
  const pathname = usePathname();
  const { overlay, trigger } = useTransitionOverlay();
  const [expanded, setExpanded] = useState(false);
  const isHome = pathname === '/member';

  // 画面遷移中は、裏のページが透けないようホームボタン自体を消しておく
  useEffect(() => {
    if (overlay) setExpanded(false);
  }, [overlay]);

  if (isHome || overlay) return null;

  const handleNavTap = (href: string, color: string, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    trigger(rect.left + rect.width / 2, rect.top + rect.height / 2, color, href);
    setExpanded(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-3 pointer-events-none">
      {NAV_ITEMS.map((item, i) => (
        <button
          key={item.href}
          type="button"
          onClick={(e) => handleNavTap(item.href, item.color, e)}
          aria-label={item.label}
          tabIndex={expanded ? 0 : -1}
          className={`w-11 h-11 rounded-full text-white card-shadow-lg flex items-center justify-center p-2.5 transition-all duration-300 ease-out ${
            expanded
              ? 'translate-x-0 opacity-100 scale-100 pointer-events-auto active:scale-90'
              : 'translate-x-10 opacity-0 scale-50 pointer-events-none'
          }`}
          style={{
            backgroundColor: item.color,
            transitionDelay: expanded ? `${(NAV_ITEMS.length - 1 - i) * 60}ms` : `${i * 40}ms`,
          }}
        >
          {item.icon}
        </button>
      ))}

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-label="ホームメニュー"
        className="w-14 h-14 rounded-full bg-blue-900 text-white card-shadow-lg flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
      >
        <svg
          className={`w-6 h-6 transition-transform ${expanded ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {expanded ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
            />
          )}
        </svg>
      </button>
    </div>
  );
}
