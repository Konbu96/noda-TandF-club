'use client';

import { useRef, useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { MemberRecord } from '@/lib/users';
import { getEventSpec, graphTickStep, recordToNumber, EventSpec } from '@/member-app/competition/events';
import { COMPETITION_EVENTS } from '@/member-app/competition/types';
import { today } from '@/member-app/menu/dateUtils';

function formatDate(date: string) {
  const [, m, d] = date.split('-');
  return m && d ? `${Number(m)}/${Number(d)}` : date;
}

// タイムは60秒以上なら「分:秒」で軸に表示する（0.1秒刻みなので小数第1位まで残す）
function formatAxis(spec: EventSpec | undefined, v: number) {
  if (spec?.kind === 'time' && v >= 60) {
    const secs = v % 60;
    return `${Math.floor(v / 60)}:${secs.toFixed(1).padStart(4, '0')}`;
  }
  return String(Math.round(v * 100) / 100);
}

// タイム種目用の縦軸目盛り。1秒ごとは太字で数字を出し、その間の0.1秒刻みは
// 数字を出さず、線（CartesianGrid）だけ薄く見えるようにする。
// ただし表示範囲が1秒に満たず「1秒ごと」の目盛りが1つも無いときは、全部の数字を出す
function YAxisTick({
  x,
  y,
  payload,
  spec,
  showAll,
}: {
  x?: number;
  y?: number;
  payload?: { value: number };
  spec: EventSpec | undefined;
  showAll: boolean;
}) {
  if (x === undefined || y === undefined || !payload) return null;
  const v = payload.value;
  const isMajor = Math.abs(v - Math.round(v)) < 1e-6;
  if (!showAll && !isMajor) return null;
  return (
    <text x={x} y={y} dy={4} textAnchor="end" fontSize={11} fontWeight={isMajor ? 700 : 400} fill={isMajor ? '#374151' : '#9ca3af'}>
      {formatAxis(spec, v)}
    </text>
  );
}

// stepの小数桁数に合わせて丸める（0.1 → 小数1桁、0.2 → 小数1桁など）
function roundToStep(v: number, step: number): number {
  const decimals = (String(step).split('.')[1] ?? '').length;
  return Number(v.toFixed(decimals));
}

// 実際のデータの最小・最大から、指定した刻み幅にぴったり合う範囲を作る。
// 上下に最低1メモリぶんの余白を必ず持たせる（点が軸線に触れないようにするため）
function niceDomain(values: number[], step: number): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = roundToStep(Math.floor(min / step) * step - step, step);
  const hi = roundToStep(Math.ceil(max / step) * step + step, step);
  return [lo, hi];
}

function buildTicks(lo: number, hi: number, step: number): number[] {
  const count = Math.round((hi - lo) / step);
  return Array.from({ length: count + 1 }, (_, i) => roundToStep(lo + i * step, step));
}

// 4月始まり・3月終わりの「年度」。1〜3月は前年の年度扱いにする
function fiscalYearOf(dateStr: string): number {
  const [y, m] = dateStr.split('-').map(Number);
  return m >= 4 ? y : y - 1;
}

function currentFiscalYear(): number {
  return fiscalYearOf(today());
}

// 遡れる一番古い年度。記録が無い今は令和7年度（2025年度）を下限にし、
// それより古い記録があれば、その年度まで遡れるようにする
const EARLIEST_SELECTABLE_FISCAL_YEAR = 2025;

// 横軸は最低10メモリぶんの幅を確保する。記録が1件しかなくても
// 10分の1の位置に置かれ、点がぽつんと真ん中に浮かないようにする。
// 記録が10件を超えたら、その件数ぶんそのまま使う（間隔は自動的に狭くなる）
const MIN_SLOTS = 10;

type ChartPoint = { date: string; value?: number; result?: string; competition?: string };

function RecordTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartPoint }[];
}) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  if (!point.date || !point.result) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg card-shadow px-3 py-1.5 text-xs">
      <p className="text-gray-500">{formatDate(point.date)}</p>
      <p className="font-medium text-gray-800">{point.result}</p>
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
  const [fiscalYear, setFiscalYear] = useState(currentFiscalYear);
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

  const maxFiscalYear = currentFiscalYear();
  const earliestRecordFiscalYear = Math.min(...records.map((r) => fiscalYearOf(r.date)));
  const minFiscalYear = Math.min(EARLIEST_SELECTABLE_FISCAL_YEAR, earliestRecordFiscalYear);

  // 選んだ年度の記録だけを日付順に並べる。月ごとにまとめず、記録があった日だけを
  // 均等な間隔の1メモリずつに割り当てる（実際の日付の間隔とは対応しない）。
  // 一番左は原点として1メモリ空け、記録はその次から並べる。
  // 10件に満たない場合は、空のメモリで10件ぶんまで埋めておく
  const buildChartData = (event: string): ChartPoint[] => {
    const points = (byEvent.get(event) ?? [])
      .map((r) => ({ ...r, value: recordToNumber(r.result) }))
      .filter((r) => !Number.isNaN(r.value) && fiscalYearOf(r.date) === fiscalYear)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (points.length === 0) return points;
    const origin: ChartPoint = { date: '' };
    const trailingCount = Math.max(MIN_SLOTS - points.length, 0);
    const padding: ChartPoint[] = Array.from({ length: trailingCount }, () => ({ date: '' }));
    return [origin, ...points, ...padding];
  };

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
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setFiscalYear((y) => Math.max(minFiscalYear, y - 1))}
              disabled={fiscalYear <= minFiscalYear}
              aria-label="前の年度"
              className="w-7 h-7 rounded-full bg-sky-50 text-blue-900 flex items-center justify-center shrink-0 disabled:opacity-30"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <p className="text-xs font-bold text-gray-700">
              {fiscalYear}年度（{fiscalYear}年4月〜{fiscalYear + 1}年3月）
            </p>
            <button
              type="button"
              onClick={() => setFiscalYear((y) => Math.min(maxFiscalYear, y + 1))}
              disabled={fiscalYear >= maxFiscalYear}
              aria-label="次の年度"
              className="w-7 h-7 rounded-full bg-sky-50 text-blue-900 flex items-center justify-center shrink-0 disabled:opacity-30"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {eventsToShow.map((event) => {
              const spec = getEventSpec(event);
              const data = buildChartData(event);
              const values = data.map((d) => d.value).filter((v): v is number => v !== undefined);
              const step = graphTickStep(spec);
              // 基準線は、表示中の年度のその種目の記録の平均値
              const yearRecords = (byEvent.get(event) ?? [])
                .map((r) => ({ ...r, value: recordToNumber(r.result) }))
                .filter((r) => !Number.isNaN(r.value) && fiscalYearOf(r.date) === fiscalYear);
              const baselineValue =
                yearRecords.length > 0
                  ? yearRecords.reduce((sum, r) => sum + r.value, 0) / yearRecords.length
                  : undefined;
              // 表示の中心は基準線。その前後graphRangeぶんを基本の表示幅にしつつ、
              // 実際の記録がそれより外にあれば、記録が見切れないようそちらまで広げる
              const range = spec?.graphRange ?? 1;
              const wanted = baselineValue !== undefined ? [baselineValue - range, baselineValue + range] : [];
              const [domainLo, domainHi] = values.length > 0 ? niceDomain([...values, ...wanted], step) : [0, 1];
              const ticks = values.length > 0 ? buildTicks(domainLo, domainHi, step) : undefined;
              // 1秒刻みの目盛りが範囲内に1つも無ければ（表示幅が1秒未満など）、代わりに全部の数字を出す
              const hasMajorTick = spec?.kind === 'time' && (ticks ?? []).some((t) => Math.abs(t - Math.round(t)) < 1e-6);
              const showAllLabels = spec?.kind !== 'time' || !hasMajorTick;

              return (
                <div key={event} className="w-full shrink-0 snap-center space-y-1">
                  <p className="text-xs text-gray-500">{event}</p>
                  {data.length === 0 ? (
                    <p className="text-xs text-gray-400">{fiscalYear}年度の記録はありません</p>
                  ) : (
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis
                            dataKey="date"
                            tickFormatter={(d: string) => (d ? formatDate(d) : '')}
                            tick={{ fontSize: 11 }}
                            interval={0}
                          />
                          <YAxis
                            tick={<YAxisTick spec={spec} showAll={showAllLabels} />}
                            domain={[domainLo, domainHi]}
                            ticks={ticks}
                            reversed={spec?.better === 'lower'}
                            tickFormatter={(v: number) => formatAxis(spec, v)}
                          />
                          <Tooltip content={<RecordTooltip />} />
                          {baselineValue !== undefined && (
                            <ReferenceLine
                              y={baselineValue}
                              stroke="#dc2626"
                              strokeDasharray="4 4"
                              strokeWidth={1.5}
                              label={{ value: formatAxis(spec, baselineValue), position: 'left', fill: '#dc2626', fontSize: 11, fontWeight: 700 }}
                            />
                          )}
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
