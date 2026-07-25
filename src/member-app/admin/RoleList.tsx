'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, UserRecord, UserRole, ROLE_LABELS } from '@/lib/users';

const ROLES = Object.entries(ROLE_LABELS) as [UserRole, string][];

export default function RoleList() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers().then((data) => {
      setUsers(data);
      setLoading(false);
    });
  }, []);

  const handleChange = async (uid: string, value: string) => {
    const role = value === '' ? null : (value as UserRole);
    await updateUserRole(uid, role);
    setUsers((prev) => prev.map((u) => (u.uid === uid ? { ...u, role } : u)));
  };

  if (loading) {
    return <div className="text-sm text-gray-400 text-center py-4">読み込み中...</div>;
  }

  if (users.length === 0) {
    return <div className="text-sm text-gray-400 text-center py-4">ユーザーがいません</div>;
  }

  return (
    <ul className="divide-y">
      {users.map((u) => (
        <li key={u.uid} className="flex items-center justify-between py-3 gap-3">
          <span className="text-sm text-gray-700 truncate flex-1">{u.displayName || u.email}</span>
          <select
            value={u.role ?? ''}
            onChange={(e) => handleChange(u.uid, e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
          >
            <option value="">未設定</option>
            {ROLES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </li>
      ))}
    </ul>
  );
}
