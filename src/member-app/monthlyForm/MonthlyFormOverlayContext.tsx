'use client';

import { createContext, useContext, useState } from 'react';

type MonthlyFormOverlayContextType = {
  open: boolean;
  show: () => void;
  hide: () => void;
};

const MonthlyFormOverlayContext = createContext<MonthlyFormOverlayContextType>({
  open: false,
  show: () => {},
  hide: () => {},
});

export function MonthlyFormOverlayProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <MonthlyFormOverlayContext.Provider value={{ open, show: () => setOpen(true), hide: () => setOpen(false) }}>
      {children}
    </MonthlyFormOverlayContext.Provider>
  );
}

export function useMonthlyFormOverlay() {
  return useContext(MonthlyFormOverlayContext);
}
