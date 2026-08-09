'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { today } from '@/member-app/menu/dateUtils';
import { getTodayMood, saveTodayMood } from './moodService';

const MOODS = [
  { id: 'great', emoji: '😆', label: 'すこぶる良い' },
  { id: 'good', emoji: '😃', label: '良い' },
  { id: 'normal', emoji: '😐', label: '普通' },
  { id: 'meh', emoji: '😑', label: 'いまいち' },
  { id: 'sick', emoji: '🤢', label: '体調が悪い' },
  { id: 'sleepy', emoji: '😴', label: '眠たい' },
  { id: 'bad_test', emoji: '😓', label: 'テスト悪い' },
  { id: 'cold', emoji: '🥶', label: '寒い' },
  { id: 'hot', emoji: '🥵', label: '暑い' },
];

export default function MoodCheck() {
  const { user } = useAuth();
  const [mood, setMood] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!user) return;
    getTodayMood(user.uid, today())
      .then((entry) => setMood(entry?.mood ?? null))
      .finally(() => setLoading(false));
  }, [user]);

  const choose = async (id: string) => {
    if (!user) return;
    setMood(id);
    setEditing(false);
    await saveTodayMood(user.uid, today(), id).catch(() => {});
  };

  if (!user || loading) return null;

  const current = MOODS.find((m) => m.id === mood);

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      {current && !editing ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{current.emoji}</span>
            <div>
              <p className="text-xs text-gray-500">今日の気分</p>
              <p className="text-sm font-medium text-gray-800">{current.label}</p>
            </div>
          </div>
          <button onClick={() => setEditing(true)} className="text-xs text-blue-900">
            変更する
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs font-bold text-blue-900 tracking-wide">今日の気分は？</p>
          <div className="grid grid-cols-5 gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => choose(m.id)}
                className={`flex flex-col items-center gap-1 py-2 rounded-xl transition-colors ${
                  mood === m.id ? 'bg-sky-100' : 'hover:bg-gray-50'
                }`}
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
