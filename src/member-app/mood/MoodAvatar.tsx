import { MOODS } from './moods';

export default function MoodAvatar({ mood }: { mood: string | null }) {
  const current = MOODS.find((m) => m.id === mood);
  return (
    <div className="w-11 h-11 rounded-full bg-sky-50 flex items-center justify-center text-2xl shrink-0">
      {current?.emoji}
    </div>
  );
}
