'use client';

import { useEffect, useState } from 'react';
import {
  currentMonth,
  currentMonthLabel,
  previousMonth,
  previousMonthLabel,
  getMonthlyFormsForMonth,
  MonthlyFormEntry,
} from './monthlyFormService';
import { useMonthlyForm } from './useMonthlyForm';

export default function EveryoneGoals({ hideUntilAnswered }: { hideUntilAnswered?: boolean }) {
  const { entry, loading: entryLoading } = useMonthlyForm();
  const [everyone, setEveryone] = useState<MonthlyFormEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (entryLoading) return;
    setLoading(true);
    getMonthlyFormsForMonth(entry ? currentMonth() : previousMonth())
      .then(setEveryone)
      .finally(() => setLoading(false));
  }, [entry, entryLoading]);

  if (entryLoading || (hideUntilAnswered && !entry)) return null;

  const label = entry ? currentMonthLabel() : previousMonthLabel();

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-2">
      <p className="text-xs font-bold text-blue-900 tracking-wide">{label}末に設定した目標</p>
      {loading ? (
        <p className="text-xs text-gray-400">読み込み中...</p>
      ) : everyone.length === 0 ? (
        <p className="text-xs text-gray-400">まだ回答がありません</p>
      ) : (
        <ul className="divide-y">
          {everyone.map((e) => (
            <li key={e.uid} className="py-2">
              <p className="text-sm text-gray-700 truncate">{e.name || '（名前未設定）'}</p>
              <p className="text-sm text-gray-800 whitespace-pre-wrap mt-0.5">{e.nextGoal || '未回答'}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
