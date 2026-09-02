'use client';

import { createContext, useContext } from 'react';
import { useTodayMood } from './useTodayMood';

type MoodContextType = {
  mood: string | null;
  choose: (id: string) => Promise<void> | void;
  loading: boolean;
};

const MoodContext = createContext<MoodContextType>({ mood: null, choose: () => {}, loading: true });

export function MoodProvider({ children }: { children: React.ReactNode }) {
  const value = useTodayMood();
  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
}

export function useMood() {
  return useContext(MoodContext);
}
