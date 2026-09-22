'use client';

import { useTransitionOverlay } from './TransitionOverlayContext';

export default function TransitionOverlay() {
  const { overlay, expanded } = useTransitionOverlay();

  if (!overlay) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none">
      {/* 演出が終わるまでは常に画面全体を覆っておき、裏で表示され始めている遷移先が透けないようにする */}
      <div className="absolute inset-0 bg-white" />
      <div
        className="absolute inset-0 transition-[clip-path] duration-1000 ease-out"
        style={{
          backgroundColor: overlay.color,
          clipPath: `circle(${expanded ? '150%' : '0px'} at ${overlay.x}px ${overlay.y}px)`,
        }}
      />
    </div>
  );
}
