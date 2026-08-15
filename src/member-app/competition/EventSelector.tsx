'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getUser } from '@/lib/users';
import { CompetitionEntry, COMPETITION_EVENTS } from './types';

export default function EventSelector({
  entries,
  onChange,
}: {
  entries: CompetitionEntry[];
  onChange: (entries: CompetitionEntry[]) => Promise<void> | void;
}) {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [draftEvents, setDraftEvents] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUser(user.uid).then((profile) => {
      setDisplayName(profile?.displayName || user.email || '');
    });
  }, [user]);

  if (!user) return null;

  const mine = entries.find((e) => e.uid === user.uid);
  const myEvents = mine?.events ?? [];

  const startEdit = () => {
    setDraftEvents(myEvents);
    setIsEditing(true);
  };

  const toggleDraft = (event: string) => {
    setDraftEvents((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]));
  };

  const handleSave = async () => {
    setSaving(true);
    const rest = entries.filter((e) => e.uid !== user.uid);
    const next = draftEvents.length > 0 ? [...rest, { uid: user.uid, displayName, events: draftEvents }] : rest;
    await onChange(next);
    setSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="space-y-2 pt-3 mt-3 border-t border-gray-100">
      <p className="text-xs text-gray-500">自分がエントリーする種目</p>

      {isEditing ? (
        <>
          <div className="flex flex-wrap gap-2">
            {COMPETITION_EVENTS.map((event) => (
              <button
                key={event}
                type="button"
                onClick={() => toggleDraft(event)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  draftEvents.includes(event)
                    ? 'bg-sky-100 text-sky-700 border-sky-300'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {event}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
              キャンセル
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-gray-800">{myEvents.length > 0 ? myEvents.join('・') : '未選択'}</p>
          <button onClick={startEdit} className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl">
            編集
          </button>
        </>
      )}
    </div>
  );
}
