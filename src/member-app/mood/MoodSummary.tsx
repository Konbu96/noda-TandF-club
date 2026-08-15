'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { today } from '@/member-app/menu/dateUtils';
import { getMoodsForDate, MoodEntry } from './moodService';
import { useTodayMood } from './useTodayMood';
import { MOODS } from './moods';

export default function MoodSummary() {
  const { mood } = useTodayMood();
  const [everyone, setEveryone] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!mood) {
      setLoading(false);
      return;
    }
    getMoodsForDate(today())
      .then(setEveryone)
      .finally(() => setLoading(false));
  }, [mood]);

  if (!mood) {
    return (
      <div className="fixed bottom-16 left-0 right-0 z-10 bg-white border-t border-gray-200 px-4 py-2.5 text-center">
        <p className="text-xs text-gray-600">
          今日の気分を決めて、みんなの気分を確認しましょう
          <Link href="/member" className="ml-2 text-blue-900 font-medium">
            選ぶ →
          </Link>
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed bottom-16 left-0 right-0 z-10 bg-white border-t border-gray-200 py-2.5 flex justify-center">
        <div className="w-4 h-4 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const grouped = MOODS
    .map((m) => ({ ...m, entries: everyone.filter((e) => e.mood === m.id) }))
    .filter((g) => g.entries.length > 0);

  if (grouped.length === 0) return null;

  const expandedGroup = grouped.find((g) => g.id === expanded);

  return (
    <div className="fixed bottom-16 left-0 right-0 z-10">
      {expandedGroup && (
        <div className="bg-white border-t border-gray-200 shadow-lg px-4 py-3">
          <p className="text-xs text-gray-500 mb-1.5">{expandedGroup.label}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {expandedGroup.entries.map((e) => (
              <span key={e.uid} className="text-xs text-gray-700">
                {e.displayName || '（名前未設定）'}
              </span>
            ))}
          </div>
        </div>
      )}
      <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-gray-400 shrink-0">みんなの気分</span>
        {grouped.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setExpanded(expanded === g.id ? null : g.id)}
            className={`relative w-9 h-9 shrink-0 rounded-full flex items-center justify-center text-lg transition-colors ${
              expanded === g.id ? 'bg-sky-100' : 'bg-gray-50'
            }`}
          >
            {g.emoji}
            <span className="absolute -bottom-1 -right-1 min-w-[14px] h-3.5 px-0.5 text-[9px] bg-blue-900 text-white rounded-full flex items-center justify-center">
              {g.entries.length}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
