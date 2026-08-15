'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserProfile, MemberRecord, UserRecord } from '@/lib/users';
import ProfileCard from '@/member-app/profile/ProfileCard';
import RecordsCard from '@/member-app/profile/RecordsCard';

export default function MemberProfileEditor() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUid, setSelectedUid] = useState('');
  const [editingUid, setEditingUid] = useState('');

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

  const selected = users.find((u) => u.uid === selectedUid);

  return (
    <div className="space-y-3">
      <select
        value={selectedUid}
        onChange={(e) => {
          setSelectedUid(e.target.value);
          setEditingUid('');
        }}
        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
      >
        <option value="">部員を選択...</option>
        {users.map((u) => (
          <option key={u.uid} value={u.uid}>
            {u.displayName || u.email}
          </option>
        ))}
      </select>

      {selected && editingUid !== selected.uid && (
        <button
          onClick={() => setEditingUid(selected.uid)}
          className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl"
        >
          編集
        </button>
      )}

      {selected && editingUid === selected.uid && (
        <div key={selected.uid} className="space-y-3">
          <ProfileCard profile={selected} onSave={(data) => saveProfile(selected.uid, data)} editableName initialEditing />
          {selected.role !== 'teacher' && selected.role !== 'manager' && (
            <RecordsCard
              records={selected.records ?? []}
              event={selected.event ?? ''}
              onSave={(records) => saveRecords(selected.uid, records)}
            />
          )}
        </div>
      )}
    </div>
  );
}
