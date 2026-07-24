'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, updateUserRole, UserRecord, UserRole, ROLE_LABELS } from '@/lib/users';

const ROLES = Object.entries(ROLE_LABELS) as [UserRole, string][];

export default function RoleManager({ onClose }: { onClose: () => void }) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white">
          <h2 className="text-base font-bold text-blue-900">ロール管理</h2>
          <button onClick={onClose} className="text-gray-400 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="p-5 text-sm text-gray-400 text-center">読み込み中...</div>
        ) : users.length === 0 ? (
          <div className="p-5 text-sm text-gray-400 text-center">ユーザーがいません</div>
        ) : (
          <ul className="divide-y">
            {users.map((u) => (
              <li key={u.uid} className="flex items-center justify-between px-5 py-3 gap-3">
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
        )}
      </div>
    </div>
  );
}
