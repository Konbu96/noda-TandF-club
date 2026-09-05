'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { currentMonth, getMonthlyForm, saveMonthlyForm, MonthlyFormAnswers, MonthlyFormEntry } from './monthlyFormService';

export function useMonthlyForm() {
  const { user } = useAuth();
  const [entry, setEntry] = useState<MonthlyFormEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    getMonthlyForm(user.uid, currentMonth())
      .then(setEntry)
      .finally(() => setLoading(false));
  }, [user]);

  const submit = async (answers: MonthlyFormAnswers) => {
    if (!user) return;
    const month = currentMonth();
    await saveMonthlyForm(user.uid, month, answers);
    setEntry({ uid: user.uid, month, ...answers, updatedAt: new Date().toISOString() });
  };

  return { entry, submit, loading };
}
