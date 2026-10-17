'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { today, formatDateWithWeekday } from './dateUtils';
import { PRACTICE_DISTANCES, PracticeDistance, getPracticeEventSpec } from './practiceEvents';
import { getAllPracticeRecords, PracticeRecord } from './practiceRecordService';
import {
  buildDateChartData,
  currentFiscalYear,
  EARLIEST_SELECTABLE_FISCAL_YEAR,
  fiscalYearOf,
  RecordLineChart,
} from '@/member-app/profile/recordChart';
import { recordToNumber } from '@/member-app/competition/events';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
    </svg>
  );
}

export default function PracticeRecordGraph() {
  const { user } = useAuth();
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [fiscalYear, setFiscalYear] = useState(currentFiscalYear);
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

  const [allRecords, setAllRecords] = useState<PracticeRecord[]>([]);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    if (!user) return;
    getAllPracticeRecords()
      .then((r) => {
        setAllRecords(r);
        setRecords(r.filter((rec) => rec.uid === user.uid));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-5 h-5 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const byDistance = new Map<PracticeDistance, PracticeRecord[]>();
  for (const d of PRACTICE_DISTANCES) byDistance.set(d, []);
  for (const r of records) byDistance.get(r.distance)?.push(r);

  const maxFiscalYear = currentFiscalYear();
  const earliestRecordFiscalYear =
    records.length > 0 ? Math.min(...records.map((r) => fiscalYearOf(r.date))) : EARLIEST_SELECTABLE_FISCAL_YEAR;
  const minFiscalYear = Math.min(EARLIEST_SELECTABLE_FISCAL_YEAR, earliestRecordFiscalYear);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el || el.clientWidth === 0) return;
    setActiveIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  const current = Math.min(activeIndex, PRACTICE_DISTANCES.length - 1);

  const goTo = (index: number) => {
    const el = trackRef.current;
    if (!el || index < 0 || index > PRACTICE_DISTANCES.length - 1) return;
    el.scrollTo({ left: el.clientWidth * index, behavior: 'smooth' });
  };

  const byDate = new Map<string, PracticeRecord[]>();
  for (const r of allRecords) {
    if (!byDate.has(r.date)) byDate.set(r.date, []);
    byDate.get(r.date)!.push(r);
  }
  const datesWithRecords = Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a)); // 新しい日付から
  const allDates = datesWithRecords.filter((d) => !filterDate || d === filterDate);

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-5">
      <div>
        <p className="text-sm font-bold text-blue-900">練習記録グラフ</p>
        <p className="text-[10px] text-gray-400">30m・60m・80mのタイム</p>
      </div>

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
          {PRACTICE_DISTANCES.map((d) => {
            const dSpec = getPracticeEventSpec(d);
            const dRecords = byDistance.get(d) ?? [];

            // 同じ日に複数本測ることがあるので、1日1点になるようその日の一番良い記録にまとめる
            const byDay = new Map<string, number[]>();
            for (const r of dRecords) {
              const value = recordToNumber(r.result);
              if (Number.isNaN(value)) continue;
              if (!byDay.has(r.date)) byDay.set(r.date, []);
              byDay.get(r.date)!.push(value);
            }
            const dailyBest = Array.from(byDay.entries()).map(([date, values]) => ({
              date,
              result: (dSpec?.better === 'higher' ? Math.max(...values) : Math.min(...values)).toFixed(dSpec?.decimals ?? 2),
            }));

            // 大会記録と違い、練習記録は表示件数を直近10件で固定する（新しい記録が入ると一番古いものを落とす）
            const latestTen = dailyBest
              .filter((r) => fiscalYearOf(r.date) === fiscalYear)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(-10);

            const data = buildDateChartData(latestTen, fiscalYear, recordToNumber);
            const yearRecords = dRecords
              .map((r) => ({ ...r, value: recordToNumber(r.result) }))
              .filter((r) => !Number.isNaN(r.value) && fiscalYearOf(r.date) === fiscalYear);
            const baselineValue =
              yearRecords.length > 0
                ? yearRecords.reduce((sum, r) => sum + r.value, 0) / yearRecords.length
                : undefined;

            return (
              <div key={d} className="w-full shrink-0 snap-center space-y-1">
                <p className="text-xs text-gray-500">{d}</p>
                {data.length === 0 ? (
                  <p className="text-xs text-gray-400">{fiscalYear}年度の記録はありません</p>
                ) : (
                  <RecordLineChart data={data} spec={dSpec} baselineValue={baselineValue} />
                )}
              </div>
            );
          })}
        </div>

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
            {PRACTICE_DISTANCES.map((d, i) => (
              <span
                key={d}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-4 bg-blue-900' : 'w-1.5 bg-gray-300'}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(current + 1)}
            disabled={current === PRACTICE_DISTANCES.length - 1}
            aria-label="次のグラフ"
            className="w-8 h-8 rounded-full bg-sky-50 text-blue-900 flex items-center justify-center disabled:opacity-30"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowAllRecords((v) => !v)}
          className="w-full text-xs text-gray-500 border border-dashed border-gray-300 rounded-xl py-2.5"
        >
          {showAllRecords ? '▲ 閉じる' : '▼ みんなの記録を見る'}
        </button>

        {showAllRecords && (
          <div className="pt-1 space-y-2">
            <div className="flex items-center gap-2">
              <select
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setExpandedDate(e.target.value || null);
                }}
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
              >
                <option value="">日付を選択（記録のある日のみ）</option>
                {datesWithRecords.map((d) => (
                  <option key={d} value={d}>
                    {formatDateWithWeekday(d)}
                  </option>
                ))}
              </select>
              {filterDate && (
                <button type="button" onClick={() => setFilterDate('')} className="text-xs text-blue-900 shrink-0">
                  すべて表示
                </button>
              )}
            </div>
            {allDates.length === 0 ? (
              <p className="text-xs text-gray-400 py-2">
                {filterDate ? 'この日の記録はありません' : 'まだ記録がありません'}
              </p>
            ) : (
              <div className="divide-y">
                {allDates.map((d) => {
                  const isOpen = expandedDate === d;
                  const entries = byDate.get(d) ?? [];
                  return (
                    <div key={d}>
                      <button
                        type="button"
                        onClick={() => setExpandedDate(isOpen ? null : d)}
                        className="w-full flex items-center justify-between py-2"
                      >
                        <span className="text-sm text-gray-800">
                          {formatDateWithWeekday(d)}（{entries.length}件）
                        </span>
                        <ChevronIcon open={isOpen} />
                      </button>
                      {isOpen && (
                        <ul className="pb-2 space-y-1">
                          {entries.map((r) => (
                            <li key={r.id} className="flex items-center justify-between gap-2 text-sm text-gray-700 py-1">
                              <span className="flex-1 truncate">{r.displayName || '（名前未設定）'}</span>
                              <span className="text-gray-500 shrink-0">
                                {r.distance}：{r.result}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
