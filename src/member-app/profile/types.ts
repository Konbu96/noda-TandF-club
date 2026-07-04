export type MemberProfile = {
  name: string;
  grade: string;
  gender: '男' | '女';
  block: '短距離' | '中長距離' | '跳躍';
  event: string;
  bibNumber: string;
  restDay: string;
};

export type Record = {
  id: string;
  event: string;
  result: string;
  date: string;
  competition: string;
};
