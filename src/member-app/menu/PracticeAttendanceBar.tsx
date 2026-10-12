'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getAllUsers, UserRecord } from '@/lib/users';
import { today } from './dateUtils';
import { PRACTICE_DISTANCES, PracticeDistance, getPracticeEventSpec } from './practiceEvents';
import { addPracticeRecords, getAllPracticeRecords, PracticeRecord } from './practiceRecordService';
import { formatRecordInput, nextRecordInput, recordPlaceholder } from '@/member-app/competition/events';

// 入力は常に末尾から入るので、カーソルは常に一番右に置く
function moveCaretToEnd(e: React.SyntheticEvent<HTMLInputElement>) {
  const el = e.currentTarget;
  requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
}

type Step = 'closed' | 'attendance' | 'input';

// メニューの予定とは関係なく、常に自分の意思で出席・一括入力を開けるようにする
export default function PracticeAttendanceBar() {
  const { user } = useAuth();
  const [roster, setRoster] = useState<UserRecord[]>([]);
  const [allRecords, setAllRecords] = useState<PracticeRecord[]>([]);

  const [step, setStep] = useState<Step>('closed');
  const [attendanceConfirmed, setAttendanceConfirmed] = useState(false);
  const [absent, setAbsent] = useState<Record<string, boolean>>({});
  const [distance, setDistance] = useState<PracticeDistance>('30m');
  const [drafts, setDrafts] = useState<Record<PracticeDistance, Record<string, string>>>({ '30m': {}, '60m': {}, '80m': {} });
  const [saving, setSaving] = useState(false);

  const refreshAll = () => getAllPracticeRecords().then(setAllRecords).catch(() => {});

  useEffect(() => {
    if (!user) return;
    getAllUsers()
      .then((users) => setRoster(users.filter((u) => u.role !== 'teacher')))
      .catch(() => setRoster([]));
    refreshAll();
  }, [user]);

  const presentMembers = roster.filter((m) => !absent[m.uid]);
  const todaysByDistance = allRecords.filter((r) => r.date === today() && r.distance === distance);
  const savedByUid = new Map<string, PracticeRecord>();
  for (const r of todaysByDistance) savedByUid.set(r.uid, r);

  const filledCount = presentMembers.filter((m) => savedByUid.has(m.uid)).length;
  const draftsForDistance = drafts[distance] ?? {};
  const hasDraft = presentMembers.some((m) => !savedByUid.has(m.uid) && !!draftsForDistance[m.uid]);

  const toggleAbsent = (uid: string) => setAbsent((prev) => ({ ...prev, [uid]: !prev[uid] }));
  const resetAbsent = () => setAbsent({});

  const setDraft = (uid: string, value: string) =>
    setDrafts((prev) => ({ ...prev, [distance]: { ...prev[distance], [uid]: value } }));

  const saveAll = async () => {
    const spec = getPracticeEventSpec(distance);
    const entries = presentMembers
      .filter((m) => !savedByUid.has(m.uid) && !!draftsForDistance[m.uid])
      .map((m) => ({
        uid: m.uid,
        displayName: m.displayName || m.email,
        distance,
        result: formatRecordInput(spec, draftsForDistance[m.uid]),
        date: today(),
      }))
      .filter((e) => !!e.result);
    if (entries.length === 0) return;
    setSaving(true);
    await addPracticeRecords(entries);
    await refreshAll();
    setDrafts((prev) => ({ ...prev, [distance]: {} }));
    setSaving(false);
  };

  if (step === 'closed') {
    return (
      <button
        type="button"
        onClick={() => setStep(attendanceConfirmed ? 'input' : 'attendance')}
        className="w-full flex items-center gap-3 bg-sky-50 border-t border-sky-200 px-4 py-3 text-left"
      >
        <span className="text-lg">📋</span>
        <span className="flex-1">
          <span className="block text-xs font-bold text-blue-900">
            {attendanceConfirmed
              ? `競技場出席人数 ${presentMembers.length}人・入力${filledCount}/${presentMembers.length}`
              : '競技場出席'}
          </span>
          <span className="block text-[11px] text-sky-500">
            {attendanceConfirmed ? '続きを入力する' : '出席を取って記録を入力する'}
          </span>
        </span>
        <span className="text-xs text-blue-900">›</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-30 bg-white overflow-y-auto">
      <div className="p-5 space-y-3 pb-10">
        {step === 'attendance' && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-blue-900">競技場出席の確認</p>
                <p className="text-[11px] text-gray-400 mt-0.5">来ている人をチェックしてください</p>
              </div>
              <button type="button" onClick={() => setStep('closed')} aria-label="閉じる" className="text-gray-400 px-1">
                ✕
              </button>
            </div>

            <div className="flex items-center justify-between bg-sky-50 rounded-xl px-4 py-2.5">
              <p className="text-xs font-bold text-blue-900">競技場出席人数 {presentMembers.length}/{roster.length}人</p>
              <button type="button" onClick={resetAbsent} className="text-xs text-blue-900">
                全員出席にする
              </button>
            </div>

            <div className="divide-y">
              {roster.map((m) => {
                const isAbsent = !!absent[m.uid];
                return (
                  <button
                    key={m.uid}
                    type="button"
                    onClick={() => toggleAbsent(m.uid)}
                    className="w-full flex items-center gap-3 py-2.5 text-left"
                  >
                    <span
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isAbsent ? 'bg-gray-100 text-gray-400' : 'bg-sky-100 text-blue-900'
                      }`}
                    >
                      {(m.displayName || m.email || '?').slice(0, 1)}
                    </span>
                    <span className="flex-1 text-sm text-gray-800 truncate">{m.displayName || m.email}</span>
                    <span
                      className={`text-xs font-bold rounded-full px-3 py-1 border ${
                        isAbsent ? 'border-gray-300 bg-gray-50 text-gray-400' : 'border-blue-900 bg-sky-50 text-blue-900'
                      }`}
                    >
                      {isAbsent ? '欠席' : '出席'}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setAttendanceConfirmed(true);
                  setStep('closed');
                }}
                className="flex-1 text-sm font-bold border border-blue-900 text-blue-900 py-3 rounded-xl"
              >
                保存する
              </button>
              <button
                type="button"
                onClick={() => {
                  setAttendanceConfirmed(true);
                  setStep('input');
                }}
                className="flex-1 text-sm font-bold bg-blue-900 text-white py-3 rounded-xl"
              >
                スタブロ記録入力
              </button>
            </div>
          </>
        )}

        {step === 'input' && (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-blue-900">練習記録を一括入力</p>
                <p className="text-[11px] text-gray-400 mt-0.5">出席している{presentMembers.length}人だけが並んでいます</p>
              </div>
              <button type="button" onClick={() => setStep('closed')} aria-label="閉じる" className="text-gray-400 px-1">
                ✕
              </button>
            </div>

            <button type="button" onClick={() => setStep('attendance')} className="text-xs text-blue-900">
              ← 出席を直す
            </button>

            <div className="flex gap-2">
              {PRACTICE_DISTANCES.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDistance(d)}
                  className={`flex-1 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    distance === d ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-white text-gray-600 border-gray-300'
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
                  style={{ width: `${presentMembers.length > 0 ? Math.round((filledCount / presentMembers.length) * 100) : 0}%` }}
                />
              </div>
              <p className="text-xs font-bold text-blue-900 whitespace-nowrap">
                {filledCount}/{presentMembers.length}人
              </p>
            </div>

            <div className="divide-y">
              {presentMembers.map((m) => {
                const spec = getPracticeEventSpec(distance);
                const saved = savedByUid.get(m.uid);
                const draftValue = draftsForDistance[m.uid] ?? '';
                return (
                  <div key={m.uid} className="flex items-center gap-3 py-2.5">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-gray-100 text-gray-400">
                      {(m.displayName || m.email || '?').slice(0, 1)}
                    </span>
                    <span className="flex-1 text-sm text-gray-800 truncate">{m.displayName || m.email}</span>
                    {saved ? (
                      <span className="text-sm font-bold text-green-600 w-20 text-right shrink-0">✓ {saved.result}</span>
                    ) : (
                      <input
                        type="text"
                        inputMode="numeric"
                        value={draftValue}
                        onChange={(e) => setDraft(m.uid, nextRecordInput(spec, draftValue, e.target.value))}
                        onFocus={moveCaretToEnd}
                        onBlur={() => setDraft(m.uid, formatRecordInput(spec, draftValue))}
                        placeholder={recordPlaceholder(spec)}
                        className="w-20 text-sm text-right border border-gray-300 rounded-lg px-2 py-1.5 shrink-0 focus:outline-none focus:ring-1 focus:ring-blue-900"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={saveAll}
              disabled={saving || !hasDraft}
              className="w-full text-sm font-bold text-white py-3 rounded-xl disabled:opacity-40 bg-blue-900"
            >
              {saving ? '保存中...' : hasDraft ? 'まとめて保存' : '入力してください'}
            </button>
            <button type="button" onClick={() => setStep('closed')} className="w-full text-xs text-gray-500 py-1">
              保存していつもの画面に戻る
            </button>
          </>
        )}
      </div>
    </div>
  );
}
