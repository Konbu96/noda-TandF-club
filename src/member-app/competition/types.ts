import { EVENT_MASTER } from './events';

export type CompetitionEntry = {
  uid: string;
  displayName: string;
  events: string[];
  results?: Record<string, string>; // 種目名 → 自己記録（このentryの本人が入力）
};

// エントリー種目の選択肢。種目の増減・変更は events.ts（マスター）で行う。
export const COMPETITION_EVENTS = EVENT_MASTER.map((e) => e.name);

export type CompetitionLink = {
  id: string;
  title: string;
  url: string;
  addedAt: string; // 追加した日（YYYY-MM-DD）。一定期間で自動的に消す
};

export type Competition = {
  id: string;
  name: string;
  date: string;
  location: string;
  entries: CompetitionEntry[];
  updatedBy: string;
  updatedAt: string;
};
