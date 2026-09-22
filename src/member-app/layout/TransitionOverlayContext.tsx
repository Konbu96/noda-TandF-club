'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Overlay = { x: number; y: number; color: string } | null;

type TransitionOverlayContextType = {
  overlay: Overlay;
  expanded: boolean;
  trigger: (x: number, y: number, color: string, href: string) => void;
};

const TransitionOverlayContext = createContext<TransitionOverlayContextType>({
  overlay: null,
  expanded: false,
  trigger: () => {},
});

const REVEAL_DURATION = 950;

export function TransitionOverlayProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [expanded, setExpanded] = useState(false);

  // 遷移先のページをアニメーション開始と同時に裏で開いておき、
  // 展開が終わった時にはもう読み込みが終わっている状態を目指す
  const trigger = useCallback(
    (x: number, y: number, color: string, href: string) => {
      setOverlay({ x, y, color });
      setExpanded(false);
      router.push(href);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setExpanded(true));
      });
    },
    [router]
  );

  useEffect(() => {
    if (!overlay || !expanded) return;
    const timer = setTimeout(() => {
      setOverlay(null);
      setExpanded(false);
    }, REVEAL_DURATION);
    return () => clearTimeout(timer);
  }, [overlay, expanded]);

  return (
    <TransitionOverlayContext.Provider value={{ overlay, expanded, trigger }}>
      {children}
    </TransitionOverlayContext.Provider>
  );
}

export function useTransitionOverlay() {
  return useContext(TransitionOverlayContext);
}
