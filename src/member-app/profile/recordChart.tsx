'use client';

// 記録グラフの共通部品。大会の記録グラフ（RecordGraph）と、
// メニュー画面の練習記録グラフ（PracticeRecordGraph）の両方から使う。

import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EventSpec, graphTickStep } from '@/member-app/competition/events';
import { today } from '@/member-app/menu/dateUtils';

export function formatDate(date: string) {
  const [, m, d] = date.split('-');
  return m && d ? `${Number(m)}/${Number(d)}` : date;
}

// タイムは60秒以上なら「分:秒」で軸に表示する（0.1秒刻みなので小数第1位まで残す）
export function formatAxis(spec: EventSpec | undefined, v: number) {
  if (spec?.kind === 'time' && v >= 60) {
    const secs = v % 60;
    return `${Math.floor(v / 60)}:${secs.toFixed(1).padStart(4, '0')}`;
  }
  return String(Math.round(v * 100) / 100);
}

// stepの小数桁数に合わせて丸める（0.1 → 小数1桁、0.2 → 小数1桁など）
export function roundToStep(v: number, step: number): number {
  const decimals = (String(step).split('.')[1] ?? '').length;
  return Number(v.toFixed(decimals));
}

// 実際のデータの最小・最大から、指定した刻み幅にぴったり合う範囲を作る。
// 上下に最低1メモリぶんの余白を必ず持たせる（点が軸線に触れないようにするため）
export function niceDomain(values: number[], step: number): [number, number] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const lo = roundToStep(Math.floor(min / step) * step - step, step);
  const hi = roundToStep(Math.ceil(max / step) * step + step, step);
  return [lo, hi];
}

export function buildTicks(lo: number, hi: number, step: number): number[] {
  const count = Math.round((hi - lo) / step);
  return Array.from({ length: count + 1 }, (_, i) => roundToStep(lo + i * step, step));
}

// 4月始まり・3月終わりの「年度」。1〜3月は前年の年度扱いにする
export function fiscalYearOf(dateStr: string): number {
  const [y, m] = dateStr.split('-').map(Number);
  return m >= 4 ? y : y - 1;
}

export function currentFiscalYear(): number {
  return fiscalYearOf(today());
}

// 遡れる一番古い年度。記録が無い今は令和7年度（2025年度）を下限にし、
// それより古い記録があれば、その年度まで遡れるようにする
export const EARLIEST_SELECTABLE_FISCAL_YEAR = 2025;

// 横軸は最低10メモリぶんの幅を確保する。記録が1件しかなくても
// 10分の1の位置に置かれ、点がぽつんと真ん中に浮かないようにする。
// 記録が10件を超えたら、その件数ぶんそのまま使う（間隔は自動的に狭くなる）
export const MIN_SLOTS = 10;

export type ChartPoint = { date: string; value?: number; result?: string; competition?: string };

// 選んだ年度の記録だけを日付順に並べる。記録があった日だけを均等な間隔の1メモリずつに割り当てる
// （実際の日付の間隔とは対応しない）。一番左は原点として1メモリ空け、記録はその次から並べる。
// 10件に満たない場合は、空のメモリで10件ぶんまで埋めておく
export function buildDateChartData(
  items: { date: string; result: string; competition?: string }[],
  fiscalYear: number,
  recordToNumber: (result: string) => number
): ChartPoint[] {
  const points = items
    .map((r) => ({ ...r, value: recordToNumber(r.result) }))
    .filter((r) => !Number.isNaN(r.value) && fiscalYearOf(r.date) === fiscalYear)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (points.length === 0) return points;
  const origin: ChartPoint = { date: '' };
  const trailingCount = Math.max(MIN_SLOTS - points.length, 0);
  const padding: ChartPoint[] = Array.from({ length: trailingCount }, () => ({ date: '' }));
  return [origin, ...points, ...padding];
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

export function RecordTooltip({
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

// グラフ本体（折れ線・縦横軸・基準線）。dataは buildDateChartData で作ったものを渡す
export function RecordLineChart({
  data,
  spec,
  baselineValue,
}: {
  data: ChartPoint[];
  spec: EventSpec | undefined;
  baselineValue?: number;
}) {
  const values = data.map((d) => d.value).filter((v): v is number => v !== undefined);
  const step = graphTickStep(spec);
  const range = spec?.graphRange ?? 1;
  const wanted = baselineValue !== undefined ? [baselineValue - range, baselineValue + range] : [];
  const [domainLo, domainHi] = values.length > 0 ? niceDomain([...values, ...wanted], step) : [0, 1];
  const ticks = values.length > 0 ? buildTicks(domainLo, domainHi, step) : undefined;
  // 1秒刻みの目盛りが範囲内に1つも無ければ（表示幅が1秒未満など）、代わりに全部の数字を出す
  const hasMajorTick = spec?.kind === 'time' && (ticks ?? []).some((t) => Math.abs(t - Math.round(t)) < 1e-6);
  const showAllLabels = spec?.kind !== 'time' || !hasMajorTick;

  return (
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
  );
}
