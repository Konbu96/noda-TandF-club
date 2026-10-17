'use client';

import { MOODS } from './moods';

export default function MoodPicker({
  mood,
  onChoose,
}: {
  mood: string | null;
  onChoose: (id: string) => void;
}) {
  if (mood) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-bold text-blue-900 tracking-wide">今日の気分は？</p>
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
