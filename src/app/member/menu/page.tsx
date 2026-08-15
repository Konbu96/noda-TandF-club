'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/member-app/auth/AuthContext';
import { deleteMenu, listMenuDates } from '@/member-app/menu/menuService';
import { today, formatDateWithWeekday } from '@/member-app/menu/dateUtils';
import MoodSummary from '@/member-app/mood/MoodSummary';

export default function MenuListPage() {
  const { canEditMenu, loading: authLoading } = useAuth();
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDate, setNewDate] = useState(today());

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    (async () => {
      setLoading(true);
      const docDates = await listMenuDates().catch(() => [] as string[]);
      const t = today();
      const future = docDates.filter((d) => d >= t);
      const expired = docDates.filter((d) => d < t);

      if (canEditMenu && expired.length > 0) {
        Promise.all(expired.map((d) => deleteMenu(d))).catch(() => {});
      }

      const merged = Array.from(new Set([t, ...future])).sort();
      if (!cancelled) {
        setDates(merged);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, canEditMenu]);

  return (
    <div className="px-4 py-6 pb-16 space-y-4">
      <div className="text-sm text-gray-500">メニュー</div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {canEditMenu && (
            <div className="flex gap-2">
              <input
                type="date"
                min={today()}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
              />
              <Link
                href={newDate ? `/member/menu/${newDate}` : '#'}
                aria-disabled={!newDate}
                className={`text-sm px-4 py-2 rounded-xl ${newDate ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-400 pointer-events-none'}`}
              >
                追加
              </Link>
            </div>
          )}

          <div className="space-y-2">
            {dates.map((d) => (
              <Link
                key={d}
                href={`/member/menu/${d}`}
                className="flex items-center justify-between bg-white rounded-2xl shadow px-4 py-3 text-sm"
              >
                <span className={d === today() ? 'text-blue-900 font-medium' : 'text-gray-800'}>
                  {formatDateWithWeekday(d)}{d === today() ? '（本日）' : ''}
                </span>
                <span className="text-gray-300">›</span>
              </Link>
            ))}
          </div>

          <MoodSummary />
        </>
      )}
    </div>
  );
}
