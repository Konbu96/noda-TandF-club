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

  const [isEditingRecords, setIsEditingRecords] = useState(false);
  const [recordDraft, setRecordDraft] = useState<Record<string, string>>({});
  const [savingRecords, setSavingRecords] = useState(false);

  useEffect(() => {
    if (!user) return;
    getUser(user.uid).then((profile) => {
      setDisplayName(profile?.displayName || user.email || '');
    });
  }, [user]);

  if (!user) return null;

  const mine = entries.find((e) => e.uid === user.uid);
  const myEvents = mine?.events ?? [];
  const myResults = mine?.results ?? {};

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
    const results = Object.fromEntries(
      Object.entries(myResults).filter(([event]) => draftEvents.includes(event))
    );
    const next =
      draftEvents.length > 0
        ? [...rest, { uid: user.uid, displayName, events: draftEvents, results }]
        : rest;
    await onChange(next);
    setSaving(false);
    setIsEditing(false);
  };

  const startRecordEdit = () => {
    setRecordDraft(myResults);
    setIsEditingRecords(true);
  };

  const handleSaveRecords = async () => {
    setSavingRecords(true);
    const rest = entries.filter((e) => e.uid !== user.uid);
    const results = Object.fromEntries(
      Object.entries(recordDraft).filter(([event, value]) => myEvents.includes(event) && value.trim() !== '')
    );
    const next = [...rest, { uid: user.uid, displayName, events: myEvents, results }];
    await onChange(next);
    setSavingRecords(false);
    setIsEditingRecords(false);
  };

  return (
    <div className="space-y-3 pt-3 mt-3 border-t border-gray-100">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">自分がエントリーする種目</p>
          {!isEditing && (
            <button onClick={startEdit} className="text-xs text-blue-900">
              編集
            </button>
          )}
        </div>

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
          <p className="text-sm text-gray-800">{myEvents.length > 0 ? myEvents.join(' / ') : '未選択'}</p>
        )}
      </div>

      {!isEditing && myEvents.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">自分の記録</p>
            {!isEditingRecords && (
              <button onClick={startRecordEdit} className="text-xs text-blue-900">
                編集
              </button>
            )}
          </div>

          {isEditingRecords ? (
            <>
              {myEvents.map((event) => (
                <div key={event} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-20 shrink-0">{event}</span>
                  <input
                    type="text"
                    value={recordDraft[event] ?? ''}
                    onChange={(e) => setRecordDraft((r) => ({ ...r, [event]: e.target.value }))}
                    placeholder="例: 11.20"
                    className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={() => setIsEditingRecords(false)} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
                  キャンセル
                </button>
                <button
                  onClick={handleSaveRecords}
                  disabled={savingRecords}
                  className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50"
                >
                  {savingRecords ? '保存中...' : '保存'}
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-800">
              {myEvents.map((e) => (myResults[e] ? `${e}(${myResults[e]})` : `${e}(未入力)`)).join(' / ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
