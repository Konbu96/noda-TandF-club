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
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
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
    </div>
  );
}
