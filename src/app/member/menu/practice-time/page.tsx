'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getAllUsers, UserRecord } from '@/lib/users';
import { today } from '@/member-app/menu/dateUtils';
import { AttendanceLocation, getAttendanceForDate } from '@/member-app/menu/attendanceService';
import { attemptsFor, getPracticeEventSpec, PRACTICE_DISTANCES, PracticeDistance } from '@/member-app/menu/practiceEvents';
import { addPracticeRecords, deletePracticeRecord, getAllPracticeRecords, PracticeRecord } from '@/member-app/menu/practiceRecordService';
import { formatRecordInput, nextRecordInput, recordPlaceholder } from '@/member-app/competition/events';

// 入力は常に末尾から入るので、カーソルは常に一番右に置く
function moveCaretToEnd(e: React.SyntheticEvent<HTMLInputElement>) {
  const el = e.currentTarget;
  requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
}

export default function PracticeTimePage() {
  const { user } = useAuth();
  const [roster, setRoster] = useState<UserRecord[]>([]);
  const [stadiumUids, setStadiumUids] = useState<Set<string>>(new Set());
  const [records, setRecords] = useState<PracticeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [distance, setDistance] = useState<PracticeDistance>('30m');
  const [drafts, setDrafts] = useState<Record<PracticeDistance, Record<string, Record<number, string>>>>({
    '30m': {},
    '60m': {},
    '80m': {},
  });
  const [error, setError] = useState('');

  const refreshRecords = () =>
    getAllPracticeRecords()
      .then((all) => setRecords(all.filter((r) => r.date === today())))
      .catch(() => {});

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getAllUsers().then((users) => users.filter((u) => u.role !== 'teacher' && u.role !== 'manager')),
      getAttendanceForDate(today()),
    ])
      .then(([users, attendance]) => {
        setRoster(users);
        const byUid = new Map(attendance.map((e) => [e.uid, e.location as AttendanceLocation]));
        setStadiumUids(new Set(users.filter((u) => byUid.get(u.uid) === '競技場').map((u) => u.uid)));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
    refreshRecords();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stadiumMembers = roster.filter((m) => stadiumUids.has(m.uid));
  const spec = getPracticeEventSpec(distance);
  const attempts = attemptsFor(distance);
  const draftsForDistance = drafts[distance] ?? {};

  const savedTime = (uid: string, attempt: number) =>
    records.find((r) => r.uid === uid && r.distance === distance && r.attempt === attempt);

  const setDraft = (uid: string, attempt: number, value: string) =>
    setDrafts((prev) => ({
      ...prev,
      [distance]: { ...prev[distance], [uid]: { ...prev[distance][uid], [attempt]: value } },
    }));

  const clearDraft = (uid: string, attempt: number) =>
    setDrafts((prev) => {
      const forUid = { ...prev[distance][uid] };
      delete forUid[attempt];
      return { ...prev, [distance]: { ...prev[distance], [uid]: forUid } };
    });

  const filledCount = stadiumMembers.filter((m) =>
    Array.from({ length: attempts }, (_, i) => i + 1).every((attempt) => savedTime(m.uid, attempt))
  ).length;
  const makeEntry = (m: UserRecord, attempt: number, draft: string) => {
    const result = formatRecordInput(spec, draft);
    if (!result) return null;
    return { uid: m.uid, displayName: m.displayName || m.email, distance, result, date: today(), attempt };
  };

  // 1件だけすぐ保存する（Enterキー用）。記録済みの欄を直した場合も同じIDで上書きされる。
  // 数字を消して空のまま確定すると、その記録を削除する（今日の記録だけが対象）
  const saveOne = async (m: UserRecord, attempt: number) => {
    const draft = draftsForDistance[m.uid]?.[attempt];
    if (draft === undefined) return;
    const saved = savedTime(m.uid, attempt);
    setError('');
    try {
      if (draft === '') {
        if (saved) {
          await deletePracticeRecord(saved.id);
          await refreshRecords();
        }
        clearDraft(m.uid, attempt);
        return;
      }
      const entry = makeEntry(m, attempt, draft);
      if (!entry) return;
      await addPracticeRecords([entry]);
      await refreshRecords();
      clearDraft(m.uid, attempt);
    } catch (e) {
      console.error('タイムの保存に失敗しました', e);
      setError('保存できませんでした。時間をおいて再度お試しください。');
    }
  };

  return (
    <div className="px-4 py-6 space-y-4 pb-20">
      <div>
        <p className="text-sm font-bold text-blue-900">タイム記録</p>
      </div>

      {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      {stadiumMembers.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">
          まだ誰も「競技場」を選んでいません。メニュー画面の「競技場出席」から選んでもらってください。
        </p>
      ) : (
        <div className="bg-white rounded-2xl card-shadow p-5 space-y-4">
          <div className="flex gap-2">
            {PRACTICE_DISTANCES.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDistance(d)}
                className={`flex-1 text-sm font-bold py-2 rounded-full border transition-colors ${
                  distance === d ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-sky-50 rounded-xl px-4 py-2.5">
            <div className="flex-1 h-1.5 rounded-full bg-sky-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-900 transition-all"
                style={{ width: `${stadiumMembers.length > 0 ? Math.round((filledCount / stadiumMembers.length) * 100) : 0}%` }}
              />
            </div>
            <p className="text-xs font-bold text-blue-900 whitespace-nowrap">
              {filledCount}/{stadiumMembers.length}人
            </p>
          </div>

          <div className="divide-y">
            {stadiumMembers.map((m) => (
              <div key={m.uid} className="flex items-center gap-2 py-2.5">
                <span className="flex-1 text-sm text-gray-800 truncate min-w-0">{m.displayName || m.email}</span>
                {Array.from({ length: attempts }, (_, i) => i + 1).map((attempt) => {
                  const saved = savedTime(m.uid, attempt);
                  const draft = draftsForDistance[m.uid]?.[attempt];
                  const value = draft ?? saved?.result ?? '';
                  const isSaved = !!saved && draft === undefined;
                  return (
                    <input
                      key={attempt}
                      type="text"
                      inputMode="numeric"
                      value={value}
                      onChange={(e) => setDraft(m.uid, attempt, nextRecordInput(spec, value, e.target.value))}
                      onFocus={moveCaretToEnd}
                      onBlur={() => {
                        if (draft === undefined) return;
                        setDraft(m.uid, attempt, formatRecordInput(spec, draft));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveOne(m, attempt);
                      }}
                      placeholder={recordPlaceholder(spec)}
                      className={`w-16 text-sm text-right border rounded-lg px-1.5 py-1 shrink-0 outline-none focus:ring-1 focus:ring-blue-900 ${
                        isSaved ? 'border-green-300 text-green-600 font-bold' : 'border-gray-300'
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
