'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { today } from '@/member-app/menu/dateUtils';
import { getTodayMood, saveTodayMood } from './moodService';

export function useTodayMood() {
  const { user } = useAuth();
  const [mood, setMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getTodayMood(user.uid, today())
      .then((entry) => setMood(entry?.mood ?? null))
      .finally(() => setLoading(false));
  }, [user]);

  const choose = async (id: string) => {
    if (!user) return;
    setMood(id);
    await saveTodayMood(user.uid, user.displayName ?? user.email ?? '', today(), id).catch(() => {});
  };

  return { mood, choose, loading };
}
