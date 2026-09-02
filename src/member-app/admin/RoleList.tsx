'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserProfile, updateUserRole, UserRecord, UserRole, ROLE_LABELS } from '@/lib/users';
import ProfileCard from '@/member-app/profile/ProfileCard';

const ROLES = Object.entries(ROLE_LABELS) as [UserRole, string][];
const ROLE_ORDER = Object.keys(ROLE_LABELS) as UserRole[];

function sortByRole(users: UserRecord[]): UserRecord[] {
  return [...users].sort((a, b) => {
    const ai = a.role ? ROLE_ORDER.indexOf(a.role) : ROLE_ORDER.length;
    const bi = b.role ? ROLE_ORDER.indexOf(b.role) : ROLE_ORDER.length;
    return ai - bi;
  });
}

function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

export default function RoleList() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUid, setEditingUid] = useState<string | null>(null);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(sortByRole(data));
      setLoading(false);
    });
  }, []);

  const handleRoleChange = async (uid: string, value: string) => {
    const role = value === '' ? null : (value as UserRole);
    await updateUserRole(uid, role);
    setUsers((prev) => sortByRole(prev.map((u) => (u.uid === uid ? { ...u, role } : u))));
  };

  const saveProfile = async (uid: string, data: Partial<UserRecord>) => {
    await updateUserProfile(uid, data);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, ...data } : u)));
  };

  if (loading) {
    return <div className="text-sm text-gray-400 text-center py-4">読み込み中...</div>;
  }

  if (users.length === 0) {
    return <div className="text-sm text-gray-400 text-center py-4">ユーザーがいません</div>;
  }

  return (
    <ul className="divide-y">
      {users.map((u) => {
        const isEditing = editingUid === u.uid;
        return (
          <li key={u.uid} className="py-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-gray-700 truncate flex-1">{u.displayName || u.email}</span>
              <span className="text-sm text-gray-500">{u.role ? ROLE_LABELS[u.role] : '未設定'}</span>
              <button
                type="button"
                onClick={() => setEditingUid(isEditing ? null : u.uid)}
                className="text-gray-400 p-1"
              >
                <PencilIcon />
              </button>
            </div>

            {isEditing && (
              <div key={u.uid} className="mt-3 space-y-3">
                <div className="bg-white rounded-2xl shadow p-5 space-y-1">
                  <label className="block text-xs text-gray-500 mb-1">ロール</label>
                  <select
                    value={u.role ?? ''}
                    onChange={(e) => handleRoleChange(u.uid, e.target.value)}
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-blue-900"
                  >
                    <option value="">未設定</option>
                    {ROLES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <ProfileCard profile={u} onSave={(data) => saveProfile(u.uid, data)} editableName />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
