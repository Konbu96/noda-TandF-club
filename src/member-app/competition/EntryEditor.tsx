'use client';

import { useEffect, useState } from 'react';
import { getAllUsers, UserRecord } from '@/lib/users';
import { CompetitionEntry } from './types';

export default function EntryEditor({
  entries,
  onChange,
}: {
  entries: CompetitionEntry[];
  onChange: (entries: CompetitionEntry[]) => void;
}) {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const eventFor = (uid: string) => entries.find((e) => e.uid === uid)?.event ?? '';

  const updateEvent = (user: UserRecord, event: string) => {
    const rest = entries.filter((e) => e.uid !== user.uid);
    onChange([...rest, { uid: user.uid, displayName: user.displayName || user.email, event }]);
  };

  if (loading) {
    return <p className="text-xs text-gray-400">読み込み中...</p>;
  }

  if (users.length === 0) {
    return <p className="text-xs text-gray-400">部員がいません</p>;
  }

  return (
    <div className="space-y-1.5">
      {users.map((user) => (
        <div key={user.uid} className="flex items-center gap-2">
          <span className="flex-1 text-sm text-gray-700 truncate">{user.displayName || user.email}</span>
          <input
            type="text"
            value={eventFor(user.uid)}
            onChange={(e) => updateEvent(user, e.target.value)}
            placeholder="出場種目"
            className="w-32 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>
      ))}
    </div>
  );
}
