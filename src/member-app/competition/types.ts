export type CompetitionEntry = {
  uid: string;
  displayName: string;
  events: string[];
};

// エントリー種目の選択肢。今後追加予定。
export const COMPETITION_EVENTS = ['100m', '200m', '400m'];

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
  entriesClosed?: boolean;
  updatedBy: string;
  updatedAt: string;
};
