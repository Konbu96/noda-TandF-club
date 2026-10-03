'use client';

import { useState } from 'react';
import { formatRecordInput, getEventSpec, nextRecordInput, recordPlaceholder, recordUnitLabel } from './events';

// 入力は常に末尾から入るので、カーソルは常に一番右に置く
function moveCaretToEnd(e: React.SyntheticEvent<HTMLInputElement>) {
  const el = e.currentTarget;
  requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
}

export default function EntryRecordEditor({
  events,
  results,
  onSave,
  onCancel,
}: {
  events: string[];
  results: Record<string, string> | undefined;
  onSave: (results: Record<string, string>) => Promise<void> | void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState<Record<string, string>>(results ?? {});
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const cleaned = Object.fromEntries(
      Object.entries(draft)
        .map(([event, value]) => [event, formatRecordInput(getEventSpec(event), value)] as const)
        .filter(([event, value]) => events.includes(event) && value.trim() !== '')
    );
    await onSave(cleaned);
    setSaving(false);
  };

  return (
    <div className="mt-2 p-3 bg-gray-50 rounded-xl space-y-2">
      {events.map((event) => {
        const spec = getEventSpec(event);
        const value = draft[event] ?? '';
        return (
          <div key={event} className="flex items-center gap-2">
            <span className="text-xs text-gray-600 w-20 shrink-0">{event}</span>
            <input
              type="text"
              inputMode="numeric"
              value={value}
              onChange={(e) => {
                const raw = e.target.value;
                setDraft((r) => ({ ...r, [event]: nextRecordInput(spec, r[event] ?? '', raw) }));
              }}
              onFocus={moveCaretToEnd}
              onBlur={() => setDraft((r) => ({ ...r, [event]: formatRecordInput(spec, r[event] ?? '') }))}
              placeholder={recordPlaceholder(spec)}
              className="flex-1 min-w-0 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
            <span className="text-xs text-gray-500 w-4 shrink-0">{recordUnitLabel(spec, value)}</span>
          </div>
        );
      })}
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
