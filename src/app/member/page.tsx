'use client';

import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getUser, updateUserProfile, MemberRecord, UserRecord } from '@/lib/users';
import ProfileCard from '@/member-app/profile/ProfileCard';
import RecordsCard from '@/member-app/profile/RecordsCard';
import RoleList from '@/member-app/admin/RoleList';
import MemberProfileEditor from '@/member-app/admin/MemberProfileEditor';
import ManagerGuideEditor from '@/member-app/admin/ManagerGuideEditor';
import MoodAvatar from '@/member-app/mood/MoodAvatar';
import MoodPicker from '@/member-app/mood/MoodPicker';
import { useTodayMood } from '@/member-app/mood/useTodayMood';

export default function MemberPage() {
  const { user, role, loading } = useAuth();
  const { mood, choose } = useTodayMood();
  const [profile, setProfile] = useState<UserRecord | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUser(user.uid)
      .then(setProfile)
      .finally(() => setProfileLoading(false));
  }, [user]);

  const saveProfile = async (data: Partial<UserRecord>) => {
    if (!user) return;
    await updateUserProfile(user.uid, data);
    setProfile((prev) => (prev ? { ...prev, ...data } : prev));
  };

  const saveRecords = async (records: MemberRecord[]) => {
    if (!user) return;
    await updateUserProfile(user.uid, { records });
    setProfile((prev) => (prev ? { ...prev, records } : prev));
  };

  if (loading || profileLoading || !profile) {
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
        <div className="text-sm text-gray-500 pt-2">部員情報の編集</div>
        <MemberProfileEditor />
      </>
    );
  } else if (role === 'manager') {
    content = (
      <>
        <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-3">
          <MoodAvatar mood={mood} />
          <div>
            <p className="text-lg font-bold text-blue-900">{profile.displayName || '未設定'}</p>
            <p className="text-sm text-gray-500">{profile.grade || '未設定'}</p>
          </div>
        </div>
        <MoodPicker mood={mood} onChoose={choose} />
        <ManagerGuideEditor />
      </>
    );
  } else {
    content = (
      <>
        <ProfileCard profile={profile} moodAvatar={<MoodAvatar mood={mood} />} onSave={saveProfile} editableName />
        <MoodPicker mood={mood} onChoose={choose} />
        <RecordsCard records={profile.records ?? []} event={profile.event ?? ''} onSave={saveRecords} />
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
