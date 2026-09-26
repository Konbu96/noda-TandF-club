'use client';

import { useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MemberRecord } from '@/lib/users';

function formatDate(date: string) {
  const [, m, d] = date.split('-');
  return m && d ? `${Number(m)}/${Number(d)}` : date;
}

function RecordTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: MemberRecord }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const record = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg card-shadow px-3 py-1.5 text-xs">
      <p className="text-gray-500">{formatDate(record.date)}</p>
      <p className="font-medium text-gray-800">{record.result}</p>
    </div>
  );
}

export default function RecordGraph({
  records,
  selectedEvents,
  onSaveSelection,
}: {
  records: MemberRecord[];
  selectedEvents: string[];
  onSaveSelection: (events: string[]) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(selectedEvents);
  const [saving, setSaving] = useState(false);

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-2xl card-shadow p-5">
        <p className="text-sm font-bold text-blue-900 mb-2">記録グラフ</p>
        <p className="text-sm text-gray-400 text-center py-6">
          大会ページで記録を入力すると、ここにグラフが表示されます
        </p>
      </div>
    );
  }

  const availableEvents = Array.from(new Set(records.map((r) => r.event)));
  const eventsToShow = selectedEvents.length > 0 ? selectedEvents.filter((e) => availableEvents.includes(e)) : availableEvents;

  const byEvent = new Map<string, MemberRecord[]>();
  for (const r of records) {
    if (!byEvent.has(r.event)) byEvent.set(r.event, []);
    byEvent.get(r.event)!.push(r);
  }

  const startEdit = () => {
    setDraft(eventsToShow);
    setIsEditing(true);
  };

  const toggleDraft = (event: string) => {
    setDraft((prev) => (prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]));
  };

  const handleSave = async () => {
    setSaving(true);
    await onSaveSelection(draft);
    setSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-blue-900">記録グラフ</p>
        {!isEditing && (
          <button onClick={startEdit} className="text-xs text-blue-900">
            編集
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">グラフを作る種目を選択</p>
          <div className="flex flex-wrap gap-2">
            {availableEvents.map((event) => (
              <button
                key={event}
                type="button"
                onClick={() => toggleDraft(event)}
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
            <button onClick={() => setIsEditing(false)} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
              キャンセル
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      ) : eventsToShow.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">
          表示する種目が選択されていません。「編集」から選んでください
        </p>
      ) : (
        eventsToShow.map((event) => {
          const list = byEvent.get(event) ?? [];
          const data = list
            .map((r) => ({ ...r, value: parseFloat(r.result) }))
            .filter((r) => !Number.isNaN(r.value));

          return (
            <div key={event} className="space-y-1">
              <p className="text-xs text-gray-500">{event}</p>
              {data.length === 0 ? (
                <p className="text-xs text-gray-400">数値として読み取れる記録がありません</p>
              ) : (
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                      <Tooltip content={<RecordTooltip />} />
                      <Line type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
