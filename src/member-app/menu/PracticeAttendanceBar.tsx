'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getAllUsers, getUser, UserRecord } from '@/lib/users';
import { today } from './dateUtils';
import { AttendanceEntry, AttendanceLocation, getAttendanceForDate, setAttendance } from './attendanceService';
import { getWinterFlag, setWinterFlag } from './feeService';

type Step = 'closed' | 'open';

// 学年の自由入力（例：「中2」「高校2年」など）から中学生／高校生を大まかに判定する
function gradeLevel(grade?: string): '中学生' | '高校生' | null {
  if (!grade) return null;
  if (grade.startsWith('中')) return '中学生';
  if (grade.startsWith('高')) return '高校生';
  return null;
}

// 競技場使用料（1人あたり）。冬季は+50円
const NORMAL_PRICE = { 中学生: 60, 高校生: 120 };
const WINTER_PRICE = { 中学生: 110, 高校生: 170 };

// 居場所（競技場／学校）は各自が自分で入力する。
// タイム記録は完全に別の場所（/member/menu/practice-time）からアクセスする独立ページなので、ここからは繋げない。
// 出席の全員編集だけは、顧問・キャプテン・副キャプテン・ブロック長／メニュー編集権限を持つ人に限定する。
export default function PracticeAttendanceBar() {
  const { user, canEditMenu } = useAuth();
  const [roster, setRoster] = useState<UserRecord[]>([]);
  const [myDisplayName, setMyDisplayName] = useState('');
  const [entries, setEntries] = useState<AttendanceEntry[]>([]);
  const [step, setStep] = useState<Step>('closed');
  const [error, setError] = useState('');
  const [selfSelection, setSelfSelection] = useState<AttendanceLocation | null>(null);
  const [saving, setSaving] = useState(false);
  const [isWinter, setIsWinter] = useState(false);

  const refresh = () => getAttendanceForDate(today()).then(setEntries).catch(() => {});

  useEffect(() => {
    if (!user) return;
    getAllUsers()
      .then((users) => setRoster(users.filter((u) => u.role !== 'teacher' && u.role !== 'manager')))
      .catch(() => setRoster([]));
    getUser(user.uid).then((profile) => setMyDisplayName(profile?.displayName || user.email || ''));
    refresh();
    getWinterFlag(today()).then(setIsWinter).catch(() => {});
  }, [user]);

  if (!user) return null;

  const byUid = new Map(entries.map((e) => [e.uid, e.location]));
  // まだ選んでいない人は「学校」扱いにする（初期設定は全員学校）
  const locationOf = (uid: string): AttendanceLocation => byUid.get(uid) ?? '学校';
  const myLocation = locationOf(user.uid);
  const stadiumMembers = roster.filter((m) => locationOf(m.uid) === '競技場');
  const stadiumCount = stadiumMembers.length;
  const juniorHighCount = stadiumMembers.filter((m) => gradeLevel(m.grade) === '中学生').length;
  const highSchoolCount = stadiumMembers.filter((m) => gradeLevel(m.grade) === '高校生').length;
  const price = isWinter ? WINTER_PRICE : NORMAL_PRICE;
  const totalFee = juniorHighCount * price.中学生 + highSchoolCount * price.高校生;

  const toggleWinter = async () => {
    const next = !isWinter;
    setIsWinter(next);
    try {
      await setWinterFlag(today(), next);
    } catch (e) {
      console.error('冬季料金の切り替えに失敗しました', e);
    }
  };

  const choose = async (uid: string, displayName: string, location: AttendanceLocation) => {
    setError('');
    try {
      await setAttendance(uid, displayName, today(), location);
      refresh();
    } catch (e) {
      console.error('出席の保存に失敗しました', e);
      setError('保存できませんでした。時間をおいて再度お試しください。');
    }
  };

  const saveSelf = async () => {
    if (!selfSelection) return;
    setSaving(true);
    await choose(user.uid, myDisplayName, selfSelection);
    setSaving(false);
    setStep('closed');
  };

  if (step === 'closed') {
    return (
      <button
        type="button"
        onClick={() => {
          setSelfSelection(myLocation);
          setStep('open');
        }}
        className="w-full flex items-center gap-3 bg-sky-50 border-t border-sky-200 px-4 py-3 text-left"
      >
        <span className="text-lg">📋</span>
        <span className="flex-1">
          <span className="block text-xs font-bold text-blue-900">競技場 {stadiumCount}人</span>
          {stadiumCount > 0 && (
            <span className="block text-[11px] text-sky-500">
              中学生{juniorHighCount}人・高校生{highSchoolCount}人・使用料¥{totalFee.toLocaleString()}
            </span>
          )}
          <span className="block text-[11px] text-sky-500">あなた：{myLocation}</span>
        </span>
        <span className="text-xs text-blue-900">›</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-30 bg-white overflow-y-auto">
      <div className="p-5 space-y-4 pb-10">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-blue-900">今日の出席</p>
          <button type="button" onClick={() => setStep('closed')} aria-label="閉じる" className="text-gray-400 px-1">
            ✕
          </button>
        </div>

        {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div className="bg-sky-50 rounded-xl p-4 space-y-3">
          <p className="text-xs text-gray-500">今日の練習場所を選んでください</p>
          <div className="flex gap-2">
            {(['競技場', '学校'] as AttendanceLocation[]).map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setSelfSelection(loc)}
                className={`flex-1 text-sm font-bold py-2.5 rounded-xl border transition-colors ${
                  selfSelection === loc ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={saveSelf}
            disabled={saving || !selfSelection}
            className="w-full text-sm font-bold bg-blue-900 text-white py-2.5 rounded-xl disabled:opacity-40"
          >
            {saving ? '保存中...' : '保存する'}
          </button>
        </div>

        {stadiumCount > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-700">競技場使用料</p>
              {canEditMenu && (
                <button
                  type="button"
                  onClick={toggleWinter}
                  className={`text-[11px] font-bold rounded-full px-3 py-1 border ${
                    isWinter ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-500 border-gray-300'
                  }`}
                >
                  冬季料金{isWinter ? ' ON' : ' OFF'}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-800">
              ¥{price.中学生}×{juniorHighCount}人＋¥{price.高校生}×{highSchoolCount}人
            </p>
            <p className="text-lg font-bold text-blue-900">合計 ¥{totalFee.toLocaleString()}</p>
          </div>
        )}

        {canEditMenu && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-gray-700">全員の出席（編集可）</p>
              <p className="text-[11px] text-gray-400">
                競技場{stadiumCount}（中{juniorHighCount}・高{highSchoolCount}）
              </p>
            </div>
            <div className="divide-y">
              {roster.map((m) => {
                const loc = locationOf(m.uid);
                return (
                  <div key={m.uid} className="flex items-center gap-2 py-2.5">
                    <span className="flex-1 text-sm text-gray-800 truncate">{m.displayName || m.email}</span>
                    {(['競技場', '学校'] as AttendanceLocation[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => choose(m.uid, m.displayName || m.email, option)}
                        className={`text-xs font-bold rounded-full px-3 py-1 border shrink-0 ${
                          loc === option ? 'bg-blue-900 text-white border-blue-900' : 'bg-white text-gray-500 border-gray-300'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
