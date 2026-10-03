'use client';

import { useRef, useState } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MemberRecord } from '@/lib/users';
import { getEventSpec, recordToNumber, EventSpec } from '@/member-app/competition/events';
import { COMPETITION_EVENTS } from '@/member-app/competition/types';

function formatDate(date: string) {
  const [, m, d] = date.split('-');
  return m && d ? `${Number(m)}/${Number(d)}` : date;
}

// タイムは60秒以上なら「分:秒」で軸に表示する
function formatAxis(spec: EventSpec | undefined, v: number) {
  if (spec?.kind === 'time' && v >= 60) {
    return `${Math.floor(v / 60)}:${String(Math.round(v % 60)).padStart(2, '0')}`;
  }
  return String(v);
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
  defaultEvents,
  onSaveSelection,
}: {
  records: MemberRecord[];
  selectedEvents: string[];
  defaultEvents?: string[]; // 専門種目（複数可）。選択が未設定のときは、これらだけを表示する
  onSaveSelection: (events: string[]) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string[]>(selectedEvents);
  const [saving, setSaving] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

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
  // 基本は専門種目のみ。自分で選んだ場合はそれを優先し、専門種目が未設定／記録なしのときは全種目を出す
  const specialtyWithRecords = (defaultEvents ?? []).filter((e) => availableEvents.includes(e));
  const eventsToShow =
    selectedEvents.length > 0
      ? selectedEvents.filter((e) => COMPETITION_EVENTS.includes(e))
      : specialtyWithRecords.length > 0
        ? specialtyWithRecords
        : availableEvents;

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

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const current = Math.min(activeIndex, Math.max(eventsToShow.length - 1, 0));

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el || index < 0 || index > eventsToShow.length - 1) return;
    el.scrollTo({ left: el.clientWidth * index, behavior: 'smooth' });
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
        <div>
          <p className="text-sm font-bold text-blue-900">記録グラフ</p>
          <p className="text-[10px] text-gray-400">上にいくほど良い記録です</p>
        </div>
        {!isEditing && (
          <button onClick={startEdit} className="text-xs text-blue-900">
            編集
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <p className="text-xs text-gray-500">グラフを作る種目を選択（記録がない種目は灰色で選べません）</p>
          <div className="flex flex-wrap gap-2">
            {COMPETITION_EVENTS.map((event) => {
              const hasRecords = availableEvents.includes(event);
              const selected = draft.includes(event);
              return (
                <button
                  key={event}
                  type="button"
                  disabled={!hasRecords}
                  onClick={() => toggleDraft(event)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    !hasRecords
                      ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
                      : selected
                        ? 'bg-sky-100 text-sky-700 border-sky-300'
                        : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {event}
                </button>
              );
            })}
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
        <div className="space-y-3">
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {eventsToShow.map((event) => {
              const list = byEvent.get(event) ?? [];
              const spec = getEventSpec(event);
              const data = list
                .map((r) => ({ ...r, value: recordToNumber(r.result) }))
                .filter((r) => !Number.isNaN(r.value));

              return (
                <div key={event} className="w-full shrink-0 snap-center space-y-1">
                  <p className="text-xs text-gray-500">{event}{spec ? `（${spec.unit}）` : ''}</p>
                  {data.length === 0 ? (
                    <p className="text-xs text-gray-400">数値として読み取れる記録がありません</p>
                  ) : (
                    <div className="h-40">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 11 }} />
                          <YAxis
                            tick={{ fontSize: 11 }}
                            domain={['auto', 'auto']}
                            reversed={spec?.better === 'lower'}
                            tickFormatter={(v: number) => formatAxis(spec, v)}
                          />
                          <Tooltip content={<RecordTooltip />} />
                          <Line type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={2} dot={{ r: 3 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {eventsToShow.length > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => goTo(current - 1)}
                disabled={current === 0}
                aria-label="前のグラフ"
                className="w-8 h-8 rounded-full bg-sky-50 text-blue-900 flex items-center justify-center disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex items-center gap-1.5">
                {eventsToShow.map((event, i) => (
                  <span
                    key={event}
                    className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-blue-900' : 'w-1.5 bg-gray-300'}`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => goTo(current + 1)}
                disabled={current === eventsToShow.length - 1}
                aria-label="次のグラフ"
                className="w-8 h-8 rounded-full bg-sky-50 text-blue-900 flex items-center justify-center disabled:opacity-30"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
