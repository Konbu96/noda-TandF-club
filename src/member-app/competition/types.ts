export type CompetitionEntry = {
  uid: string;
  displayName: string;
  event: string;
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
