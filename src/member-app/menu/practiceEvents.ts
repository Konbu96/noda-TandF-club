// 練習内で何度も測る記録（大会の記録とは別）。30m・60m・80mのタイムを管理する。
// 種目の増減・調整はこのファイルだけを直せばよい（大会の種目マスターとは独立）

import { EventSpec } from '@/member-app/competition/events';

export const PRACTICE_DISTANCES = ['30m', '60m', '80m'] as const;
export type PracticeDistance = (typeof PRACTICE_DISTANCES)[number];

const practiceSpec = (name: PracticeDistance, example: string, graphRange: number): EventSpec => ({
  name,
  category: '短距離',
  kind: 'time',
  unit: '秒',
  better: 'lower',
  decimals: 2,
  example,
  graphRange,
  maxDigits: 4, // 30m/60m/80mは分:秒にはならないので、4桁（例: 99.99秒）まででよい
});

// graphRangeの数値は仮の初期値です。実際のばらつきに合わせて調整してください
export const PRACTICE_EVENTS: EventSpec[] = [
  practiceSpec('30m', '385', 0.3),
  practiceSpec('60m', '742', 0.4),
  practiceSpec('80m', '980', 0.5),
];

export function getPracticeEventSpec(distance: string): EventSpec | undefined {
  return PRACTICE_EVENTS.find((e) => e.name === distance);
}

// 1回の練習で測る本数（紙の記録に合わせて、30m/60mは2本、80mは1本）
export function attemptsFor(distance: PracticeDistance): number {
  return distance === '80m' ? 1 : 2;
}
