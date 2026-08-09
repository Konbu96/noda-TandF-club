'use client';

import { useEffect, useState } from 'react';
import { today } from '@/member-app/menu/dateUtils';
import { getMoodsForDate, MoodEntry } from './moodService';
import { MOODS } from './moods';

export default function MoodPicker({
  mood,
  onChoose,
}: {
  mood: string | null;
  onChoose: (id: string) => void;
}) {
  const [everyone, setEveryone] = useState<MoodEntry[]>([]);

  useEffect(() => {
    if (!mood) return;
    getMoodsForDate(today())
      .then(setEveryone)
      .catch(() => {});
  }, [mood]);

  const current = MOODS.find((m) => m.id === mood);

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      {current ? (
        <>
          <p className="text-sm text-gray-800">
            今日の気分：<span className="font-medium">{current.label}</span>
          </p>

          {everyone.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">みんなの今日の気分</p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
                {everyone.map((entry) => {
                  const entryMood = MOODS.find((m) => m.id === entry.mood);
                  return (
                    <div key={entry.uid} className="flex items-center gap-2 min-w-0">
                      <span className="text-lg shrink-0">{entryMood?.emoji}</span>
                      <span className="text-xs text-gray-700 truncate">{entry.displayName || '（名前未設定）'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <p className="text-xs font-bold text-blue-900 tracking-wide">今日の気分は？</p>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChoose(m.id)}
                className="flex flex-col items-center gap-1 py-2 rounded-xl transition-colors hover:bg-gray-50"
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-[10px] text-gray-500 leading-tight text-center">{m.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
