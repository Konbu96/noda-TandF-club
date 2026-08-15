'use client';

import { useState } from 'react';
import { COMPETITION_EVENTS } from './types';

export default function EntryEventEditor({
  events,
  onSave,
  onCancel,
}: {
  events: string[];
  onSave: (events: string[]) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<string[]>(events);
  const [saving, setSaving] = useState(false);

  const toggle = (event: string) =>
    setDraft((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]));

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-xl space-y-2">
      <div className="flex flex-wrap gap-2">
        {COMPETITION_EVENTS.map((event) => (
          <button
            key={event}
            type="button"
            onClick={() => toggle(event)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              draft.includes(event)
                ? 'bg-sky-100 text-sky-700 border-sky-300'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {event}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={onCancel} className="flex-1 text-xs border border-gray-300 text-gray-600 py-1.5 rounded-lg">
          キャンセル
        </button>
        <button onClick={handleSave} disabled={saving} className="flex-1 text-xs bg-blue-900 text-white py-1.5 rounded-lg disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
