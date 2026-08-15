'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserProfile, MemberRecord, UserRecord } from '@/lib/users';
import ProfileCard from '@/member-app/profile/ProfileCard';
import RecordsCard from '@/member-app/profile/RecordsCard';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
    </svg>
  );
}

export default function MemberProfileEditor() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUid, setExpandedUid] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const saveProfile = async (uid: string, data: Partial<UserRecord>) => {
    await updateUserProfile(uid, data);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...data } : u)));
  };

  const saveRecords = async (uid: string, records: MemberRecord[]) => {
    await updateUserProfile(uid, { records });
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, records } : u)));
  };

  if (loading) {
    return <div className="text-sm text-gray-400 text-center py-4">読み込み中...</div>;
  }

  if (users.length === 0) {
    return <div className="text-sm text-gray-400 text-center py-4">ユーザーがいません</div>;
  }

  return (
    <div className="space-y-2">
      {users.map((u) => {
        const isOpen = expandedUid === u.uid;
        return (
          <div key={u.uid} className="bg-white rounded-2xl shadow p-4">
            <button
              type="button"
              onClick={() => setExpandedUid(isOpen ? null : u.uid)}
              className="w-full flex items-center justify-between"
            >
              <span className="text-sm text-gray-700 truncate">{u.displayName || u.email}</span>
              <span className="text-gray-300">
                <ChevronIcon open={isOpen} />
              </span>
            </button>

            {isOpen && (
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                <ProfileCard profile={u} onSave={(data) => saveProfile(u.uid, data)} editableName />
                <RecordsCard
                  records={u.records ?? []}
                  event={u.event ?? ''}
                  onSave={(records) => saveRecords(u.uid, records)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
