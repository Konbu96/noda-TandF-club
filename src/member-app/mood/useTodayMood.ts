'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { today } from '@/member-app/menu/dateUtils';
import { getUser } from '@/lib/users';
import { deleteMood, getTodayMood, getUserMoods, saveTodayMood } from './moodService';

export function useTodayMood() {
  const { user } = useAuth();
  const [mood, setMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const t = today();
    getTodayMood(user.uid, t)
      .then((entry) => setMood(entry?.mood ?? null))
      .finally(() => setLoading(false));

    // 自分の過去の気分は、開いたタイミングで自動削除する（メニュー機能と同じ遅延クリーンアップ方式）
    getUserMoods(user.uid)
      .then((entries) => {
        const expired = entries.filter((e) => e.date < t);
        return Promise.all(expired.map((e) => deleteMood(user.uid, e.date)));
      })
      .catch(() => {});
  }, [user]);

  const choose = async (id: string) => {
    if (!user) return;
    setMood(id);
    const profile = await getUser(user.uid).catch(() => null);
    const displayName = profile?.displayName || user.displayName || user.email || '';
    await saveTodayMood(user.uid, displayName, today(), id).catch(() => {});
  };

  return { mood, choose, loading };
}
