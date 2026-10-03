'use client';

import { useTransitionOverlay } from '@/member-app/layout/TransitionOverlayContext';
import { NAV_ITEMS } from '@/member-app/layout/navItems';

// 陸上競技場の写真を背景に敷き、上に白を40%重ねて薄くする。
// 左下を基準に表示し、はみ出す部分は上・右側から切り取る。
function TrackPhoto() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-cover"
        style={{ backgroundImage: "url('/img/track-stadium.jpg')", backgroundPosition: 'left bottom' }}
      />
      <div className="absolute inset-0 bg-white/40" />
    </div>
  );
}

type LaunchItem = {
  label: string;
  href: string;
  color: string;
  align: 'start' | 'end';
  blob: string;
  icon: React.ReactNode;
};

const LAUNCH_STYLE: { align: 'start' | 'end'; blob: string }[] = [
  { align: 'start', blob: '62% 38% 55% 45% / 45% 60% 40% 55%' },
  { align: 'end', blob: '40% 60% 65% 35% / 55% 40% 60% 45%' },
  { align: 'start', blob: '55% 45% 40% 60% / 60% 45% 55% 40%' },
];

const ITEMS: LaunchItem[] = NAV_ITEMS.map((item, i) => ({ ...item, ...LAUNCH_STYLE[i] }));

export default function MemberHomePage() {
  const { overlay, trigger } = useTransitionOverlay();

  const handleTap = (item: LaunchItem, e: React.MouseEvent<HTMLButtonElement>) => {
    if (overlay) return;
    const rect = e.currentTarget.getBoundingClientRect();
    trigger(rect.left + rect.width / 2, rect.top + rect.height / 2, item.color, item.href);
  };

  return (
    <div className="relative z-0 min-h-screen flex flex-col justify-center gap-10 px-6 py-10 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <TrackPhoto />
      </div>

      {ITEMS.map((item) => (
        <button
          key={item.href}
          type="button"
          onClick={(e) => handleTap(item, e)}
          disabled={!!overlay}
          className={`w-36 h-36 text-white flex flex-col items-center justify-center gap-1.5 card-shadow-lg transition-transform active:scale-95 disabled:opacity-90 ${
            item.align === 'start' ? 'self-start ml-2' : 'self-end mr-2'
          }`}
          style={{ backgroundColor: item.color, borderRadius: item.blob }}
        >
          <div className="w-9 h-9">{item.icon}</div>
          <span className="text-sm font-bold">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
