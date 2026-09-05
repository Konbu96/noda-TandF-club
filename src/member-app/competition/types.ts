export type CompetitionEntry = {
  uid: string;
  displayName: string;
  events: string[];
};

// エントリー種目の選択肢。今後追加予定。
export const COMPETITION_EVENTS = [
  '100m',
  '200m',
  '400m',
  '110mH',
  '400mH',
  '800m',
  '1500m',
  '5000m',
  '走幅跳',
  '走高跳',
  '三段跳',
  '砲丸投',
  '円盤投',
  'ハンマー投',
  'やり投',
  '4×100mR',
  '4×400mR',
];

export type CompetitionLink = {
  id: string;
  title: string;
  url: string;
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
