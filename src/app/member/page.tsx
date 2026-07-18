import { MemberProfile, Record } from '@/member-app/profile/types';
import MemberBasicInfo from '@/member-app/profile/MemberBasicInfo';
import RecordGraph from '@/member-app/profile/RecordGraph';

const dummyProfile: MemberProfile = {
  name: '野田 太郎',
  grade: '高校2年',
  gender: '男',
  block: '短距離',
  event: '100m',
  bibNumber: '15',
  restDay: '水曜日',
  pb: '100m/11.03',
};

const dummyRecords: Record[] = [
  { id: '1', event: '100m', result: '11.8', date: '04/19(日)', competition: '春季大会' },
  { id: '2', event: '100m', result: '11.6', date: '06/06(土)', competition: '地区予選' },
  { id: '3', event: '100m', result: '11.4', date: '09/12(土)', competition: '秋季大会' },
  { id: '4', event: '100m', result: '11.2', date: '11/07(土)', competition: '県大会' },
];

export default function MemberPage() {
  return (
    <div className="px-4 py-6 space-y-4">
      <MemberBasicInfo profile={dummyProfile} />
      <RecordGraph records={dummyRecords} event={dummyProfile.event} />
    </div>
  );
}
