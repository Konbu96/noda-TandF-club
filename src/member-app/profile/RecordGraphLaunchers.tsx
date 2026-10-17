'use client';

import { useEffect, useState } from 'react';

type PanelType = 'competition' | 'practice' | null;

const COMPETITION_COLOR = '#0f766e';
const PRACTICE_COLOR = '#0369a1';

// 大会記録・練習記録のグラフは、タップした場所から絵の具が広がるように開く。
// 開いた後ろは全面を覆わず、薄い黒（40%）を敷いてマイページの内容が透けて見えるようにする。
export default function RecordGraphLaunchers({
  competitionGraph,
  practiceGraph,
}: {
  competitionGraph: React.ReactNode;
  practiceGraph: React.ReactNode;
}) {
  const [panel, setPanel] = useState<PanelType>(null);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(false);

  // パネルが開いている間はマイページ側がスクロールできないようにし、
  // 画面の高さを超えた分の背景が下に見えてしまわないようにする
  useEffect(() => {
    if (!panel) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [panel]);

  const openPanel = (type: PanelType, e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setPanel(type);
    setExpanded(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setExpanded(true));
    });
  };

  const closePanel = () => {
    setExpanded(false);
    setTimeout(() => setPanel(null), 400);
  };

  const color = panel === 'competition' ? COMPETITION_COLOR : PRACTICE_COLOR;

  return (
    <>
      <div className="flex justify-center gap-10 py-2">
        <button
          type="button"
          onClick={(e) => openPanel('competition', e)}
          className="w-28 h-28 text-white text-sm font-bold flex items-center justify-center card-shadow active:scale-95 transition-transform"
          style={{ backgroundColor: COMPETITION_COLOR, borderRadius: '62% 38% 55% 45% / 45% 60% 40% 55%' }}
        >
          大会記録
        </button>
        <button
          type="button"
          onClick={(e) => openPanel('practice', e)}
          className="w-28 h-28 text-white text-sm font-bold flex items-center justify-center card-shadow active:scale-95 transition-transform"
          style={{ backgroundColor: PRACTICE_COLOR, borderRadius: '40% 60% 65% 35% / 55% 40% 60% 45%' }}
        >
          練習記録
        </button>
      </div>

      {panel && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ backgroundColor: color, opacity: expanded ? 0.4 : 0 }}
            onClick={closePanel}
          />
          {/* タップ地点から広がる絵の具のひと刷毛（演出用、操作には反応しない） */}
          <div
            className="absolute inset-0 transition-[clip-path,opacity] duration-500 ease-out pointer-events-none"
            style={{
              backgroundColor: color,
              opacity: expanded ? 0 : 0.22,
              clipPath: `circle(${expanded ? '150%' : '0px'} at ${origin.x}px ${origin.y}px)`,
            }}
          />
          <div
            className="absolute inset-0 overflow-y-auto transition-[clip-path] duration-500 ease-out"
            style={{ clipPath: `circle(${expanded ? '150%' : '0px'} at ${origin.x}px ${origin.y}px)` }}
          >
            <div className="min-h-full flex flex-col px-4 py-6">
              <button
                type="button"
                onClick={closePanel}
                className="self-end text-xs text-white bg-black/30 rounded-full px-3 py-1.5 mb-3"
              >
                ✕ 閉じる
              </button>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-full">{panel === 'competition' ? competitionGraph : practiceGraph}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
