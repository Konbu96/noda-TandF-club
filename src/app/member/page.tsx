'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/member-app/auth/AuthContext';
import { MemberProfile, Record } from '@/member-app/profile/types';
import MemberBasicInfo from '@/member-app/profile/MemberBasicInfo';
import RecordGraph from '@/member-app/profile/RecordGraph';
import RoleList from '@/member-app/admin/RoleList';
import ManagerGuideEditor from '@/member-app/admin/ManagerGuideEditor';
import MoodCheck from '@/member-app/mood/MoodCheck';

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
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  let content;
  if (role === 'teacher') {
    content = (
      <>
        <div className="text-sm text-gray-500">ロール管理</div>
        <div className="bg-white rounded-2xl shadow p-4">
          <RoleList />
        </div>
      </>
    );
  } else if (role === 'manager') {
    content = (
      <>
        <MoodCheck />
        <ManagerGuideEditor />
      </>
    );
  } else {
    content = (
      <>
        <MoodCheck />
        <MemberBasicInfo profile={dummyProfile} />
        <RecordGraph records={dummyRecords} event={dummyProfile.event} />
      </>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4">
      {content}
      <button
        onClick={() => signOut(auth)}
        className="w-full text-sm border border-gray-300 text-gray-600 py-2 rounded-xl"
      >
        ログアウト
      </button>
    </div>
  );
}
