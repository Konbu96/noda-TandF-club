// 競技（種目）のマスター。種目名・区分・単位・良い記録の向き・小数点以下の桁数は
// すべてここで一元管理する。種目を増減・変更するときはこのファイルだけを直す。

import { MemberRecord } from '@/lib/users';

export type EventCategory = '短距離' | 'ハードル' | '中長距離' | '跳躍' | '投擲' | 'リレー';

export type EventSpec = {
  name: string;
  category: EventCategory;
  kind: 'time' | 'distance';
  unit: '秒' | 'm';
  better: 'lower' | 'higher'; // lower: 小さいほど良い（タイム） / higher: 大きいほど良い（距離・高さ）
  decimals: number; // 小数点以下の桁数
  example: string; // 入力例（数字のみ）
};

const time = (name: string, category: EventCategory, example: string, decimals = 2): EventSpec => ({
  name, category, kind: 'time', unit: '秒', better: 'lower', decimals, example,
});

const distance = (name: string, category: EventCategory, example: string, decimals = 2): EventSpec => ({
  name, category, kind: 'distance', unit: 'm', better: 'higher', decimals, example,
});

export const EVENT_MASTER: EventSpec[] = [
  time('100m', '短距離', '1120'),
  time('200m', '短距離', '2350'),
  time('400m', '短距離', '5432'),
  time('110mH', 'ハードル', '1520'),
  time('400mH', 'ハードル', '5980'),
  time('800m', '中長距離', '21055'),
  time('1500m', '中長距離', '42533'),
  time('5000m', '中長距離', '163012'),
  distance('走幅跳', '跳躍', '532'),
  distance('走高跳', '跳躍', '175'),
  distance('三段跳', '跳躍', '1234'),
  distance('砲丸投', '投擲', '1050'),
  distance('円盤投', '投擲', '3120'),
  distance('ハンマー投', '投擲', '3560'),
  distance('やり投', '投擲', '4210'),
  time('4×100mR', 'リレー', '4520'),
  time('4×400mR', 'リレー', '34500'),
];

export const EVENT_CATEGORIES: EventCategory[] = ['短距離', 'ハードル', '中長距離', '跳躍', '投擲', 'リレー'];

export function getEventSpec(name: string): EventSpec | undefined {
  return EVENT_MASTER.find((e) => e.name === name);
}

const MAX_DIGITS = 7;

// 数字だけの入力を、種目に合わせた表記に整える（電卓のように右から桁が入る）
//   タイム: 1120 → 11.20 ／ 42533 → 4:25.33 ／ 距離: 532 → 5.32
export function formatRecordInput(spec: EventSpec | undefined, raw: string): string {
  const decimals = spec?.decimals ?? 2;
  let digits = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_DIGITS);
  if (digits === '') return '';
  digits = digits.padStart(decimals + 1, '0');

  const frac = decimals > 0 ? digits.slice(-decimals) : '';
  const whole = decimals > 0 ? digits.slice(0, -decimals) : digits;
  const dot = decimals > 0 ? '.' : '';

  // タイムで秒の桁（2桁）より上があれば「分:秒」表記にする
  if (spec?.kind === 'time' && whole.length > 2) {
    const minutes = whole.slice(0, -2);
    const seconds = whole.slice(-2);
    return `${Number(minutes)}:${seconds}${dot}${frac}`;
  }
  return `${Number(whole)}${dot}${frac}`;
}

// 入力中の表示用。タイムは「:」と「.」を最初から見せる（例: 5668 → 0:56.68 ／ 12345 → 1:23.45）。
// 入力が終わったら formatRecordInput で整え直し、分が0なら「:」を消す（0:56.68 → 56.68）
export function formatRecordTyping(spec: EventSpec | undefined, raw: string): string {
  if (spec?.kind !== 'time') return formatRecordInput(spec, raw);
  const decimals = spec.decimals;
  let digits = raw.replace(/\D/g, '').replace(/^0+/, '').slice(0, MAX_DIGITS);
  if (digits === '') return '';
  digits = digits.padStart(decimals + 3, '0');
  const frac = decimals > 0 ? digits.slice(-decimals) : '';
  const whole = decimals > 0 ? digits.slice(0, -decimals) : digits;
  const dot = decimals > 0 ? '.' : '';
  return `${Number(whole.slice(0, -2))}:${whole.slice(-2)}${dot}${frac}`;
}

const significant = (v: string) => v.replace(/\D/g, '').replace(/^0+/, '');

// 「削除操作」かどうか。数字が0〜1個だけ減った場合（＝「:」「.」を消した／1桁消した）だけを削除とみなす。
// 全選択して数字を打ち直した場合などは削除にしない
function isDeletion(prevSig: string, rawSig: string): boolean {
  if (rawSig.length > prevSig.length || prevSig.length - rawSig.length > 1) return false;
  if (rawSig.length === prevSig.length) return rawSig === prevSig;
  for (let i = 0; i < prevSig.length; i++) {
    if (prevSig.slice(0, i) + prevSig.slice(i + 1) === rawSig) return true;
  }
  return false;
}

// 入力欄の onChange 用。電卓のように「一番右の桁」を出し入れする。
// 「:」「.」を消そうとした場合や、カーソルが途中にある場合でも、削除は必ず末尾の1桁が消える
export function nextRecordInput(spec: EventSpec | undefined, prev: string, raw: string): string {
  if (raw === '') return '';
  if (raw.length < prev.length) {
    const prevSig = significant(prev);
    if (isDeletion(prevSig, significant(raw))) {
      return formatRecordTyping(spec, prevSig.slice(0, -1));
    }
  }
  return formatRecordTyping(spec, raw);
}

// グラフ用に数値へ変換する（タイムは秒、距離はメートル）
export function recordToNumber(result: string): number {
  const m = result.match(/^(\d+):(\d+(?:\.\d+)?)$/);
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  return parseFloat(result);
}

// 種目ごとに一番良い記録（PB）だけを残す。タイムは最小、距離・高さは最大を採用する
export function bestRecordsByEvent(records: MemberRecord[]): MemberRecord[] {
  const bestByEvent = new Map<string, MemberRecord>();
  for (const r of records) {
    const value = recordToNumber(r.result);
    if (Number.isNaN(value)) continue;
    const current = bestByEvent.get(r.event);
    if (!current) {
      bestByEvent.set(r.event, r);
      continue;
    }
    const better = getEventSpec(r.event)?.better ?? 'lower';
    const isBetter = better === 'lower' ? value < recordToNumber(current.result) : value > recordToNumber(current.result);
    if (isBetter) bestByEvent.set(r.event, r);
  }
  return Array.from(bestByEvent.values());
}

// 入力欄のプレースホルダー（例: 「1120 → 11.20」）
export function recordPlaceholder(spec: EventSpec | undefined): string {
  if (!spec) return '数字のみ';
  return `例: ${spec.example} → ${formatRecordInput(spec, spec.example)}`;
}

// 入力欄の横に出す単位。「分:秒」表記（分が1以上）のときは単位を出さない
export function recordUnitLabel(spec: EventSpec | undefined, value: string): string {
  if (!spec) return '';
  if (spec.kind === 'time' && value.includes(':') && !value.startsWith('0:')) return '';
  return spec.unit;
}
