'use client';

import { useState } from 'react';
import { MOODS } from './moods';

export default function MoodPicker({
  mood,
  onChoose,
}: {
  mood: string | null;
  onChoose: (id: string) => void;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (mood || dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-bold text-blue-900 tracking-wide">今日の気分は？</p>
        <button onClick={() => setDismissed(true)} className="text-gray-400 p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
          {MOODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => onChoose(m.id)}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl transition-colors hover:bg-gray-50"
            >
              <span className="text-4xl">{m.emoji}</span>
              <span className="text-xs text-gray-600 leading-tight text-center">{m.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
