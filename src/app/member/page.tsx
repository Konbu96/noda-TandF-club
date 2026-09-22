'use client';

import { useTransitionOverlay } from '@/member-app/layout/TransitionOverlayContext';

const LANE_RADII = [200, 248, 295, 343, 390];
const LANE_CX = 530;
const LANE_CY = 610;
const STRAIGHT_END_Y = 900; // 画面下端より下まで、曲げずに真っ直ぐ伸ばす

// 中心から見て左上のカーブ（180°〜270°）だけを描き、そこから先は真下に直線で伸ばす
// ＝実際の陸上トラック（カーブ＋直走路）のような形にする
function lanePath(r: number) {
  const steps = 24;
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = ((270 - (90 * i) / steps) * Math.PI) / 180;
    const x = LANE_CX + r * Math.cos(t);
    const y = LANE_CY + r * Math.sin(t);
    points.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const [first, ...rest] = points;
  const straightX = (LANE_CX - r).toFixed(1);
  return `M ${first} L ${rest.join(' L ')} L ${straightX} ${STRAIGHT_END_Y}`;
}

// 陸上競技場のトラックのレーンラインを模した、背景の薄い装飾線
function TrackLanes() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 400 800"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
    >
      {LANE_RADII.slice(1).map((r, i) => {
        const prev = LANE_RADII[i];
        const mid = (prev + r) / 2;
        return (
          <path
            key={`band-${prev}`}
            d={lanePath(mid)}
            stroke="#dc2626"
            strokeOpacity={0.12}
            strokeWidth={r - prev}
            fill="none"
          />
        );
      })}
      {LANE_RADII.map((r) => (
        <path key={r} d={lanePath(r)} stroke="#dc2626" strokeOpacity={0.35} strokeWidth={5} fill="none" />
      ))}
    </svg>
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

const ITEMS: LaunchItem[] = [
  {
    label: 'マイページ',
    href: '/member/mypage',
    color: '#1e3a8a',
    align: 'start',
    blob: '62% 38% 55% 45% / 45% 60% 40% 55%',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    label: 'メニュー',
    href: '/member/menu',
    color: '#0369a1',
    align: 'end',
    blob: '40% 60% 65% 35% / 55% 40% 60% 45%',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: '大会',
    href: '/member/competition',
    color: '#0f766e',
    align: 'start',
    blob: '55% 45% 40% 60% / 60% 45% 55% 40%',
    icon: (
      <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
];

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
        <TrackLanes />
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
          {item.icon}
          <span className="text-sm font-bold">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
