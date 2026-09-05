'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getUser } from '@/lib/users';
import {
  currentMonth,
  currentMonthLabel,
  getMonthlyFormsForMonth,
  MonthlyFormAnswers,
  MonthlyFormEntry,
} from '@/member-app/monthlyForm/monthlyFormService';
import { useMonthlyForm } from '@/member-app/monthlyForm/useMonthlyForm';

const LEVELS = ['1', '2', '3', '4', '5'];

const EMPTY: MonthlyFormAnswers = {
  name: '',
  lastMonthGoal: '',
  achievementLevel: '',
  reflection: '',
  nextGoal: '',
};

export default function MonthlyFormPage() {
  const { user } = useAuth();
  const { entry, submit, loading } = useMonthlyForm();
  const [draft, setDraft] = useState<MonthlyFormAnswers>(EMPTY);
  const [saving, setSaving] = useState(false);

  const [everyone, setEveryone] = useState<MonthlyFormEntry[]>([]);
  const [everyoneLoading, setEveryoneLoading] = useState(true);
  useEffect(() => {
    if (entry || !user) return;
    getUser(user.uid)
      .then((profile) => setDraft({ ...EMPTY, name: profile?.displayName || '' }))
      .catch(() => {});
  }, [entry, user]);

  useEffect(() => {
    if (!entry) return;
    getMonthlyFormsForMonth(currentMonth())
      .then(setEveryone)
      .finally(() => setEveryoneLoading(false));
  }, [entry]);

  const handleSave = async () => {
    setSaving(true);
    await submit(draft);
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="text-sm text-gray-500">{currentMonthLabel()}フォーム</div>

      {entry ? (
        <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          <p className="text-sm font-bold text-blue-900">{currentMonthLabel()}月末フォームは回答済みです。</p>

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <p className="text-xs text-gray-500">みんなの回答</p>
            {everyoneLoading ? (
              <p className="text-xs text-gray-400">読み込み中...</p>
            ) : everyone.length === 0 ? (
              <p className="text-xs text-gray-400">まだ回答がありません</p>
            ) : (
              <ul className="divide-y">
                {everyone.map((e) => (
                  <li key={e.uid} className="py-2">
                    <p className="text-sm text-gray-700 truncate">{e.name || '（名前未設定）'}</p>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap mt-0.5">{e.nextGoal || '未回答'}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          <p className="text-xs text-gray-500">月末の振り返り、目標設定の回答は全員で共有します</p>

          <div>
            <p className="text-xs text-gray-500 mb-1">氏名</p>
            <p className="text-sm text-gray-800">{draft.name || '未設定'}</p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">あなたの先月の個人目標は何でしたか？</label>
            <textarea
              value={draft.lastMonthGoal}
              onChange={(e) => setDraft({ ...draft, lastMonthGoal: e.target.value })}
              rows={3}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">目標をどのくらい達成できたか、自分が思うものを選んでください</label>
            <div className="flex gap-2">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDraft({ ...draft, achievementLevel: level })}
                  className={`flex-1 text-sm py-2 rounded-lg border transition-colors ${
                    draft.achievementLevel === level
                      ? 'bg-sky-100 text-sky-700 border-sky-300'
                      : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-1">1：達成できなかった 〜 5：完璧に達成できた</p>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">
              この1ヶ月で目標のどのような部分が達成できたのか・達成できなかったのかや、新たに生まれた課題について具体的に書いてください
            </label>
            <textarea
              value={draft.reflection}
              onChange={(e) => setDraft({ ...draft, reflection: e.target.value })}
              rows={4}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">上記の内容や目標達成シートを参考に来月の個人目標を入力してください</label>
            <textarea
              value={draft.nextGoal}
              onChange={(e) => setDraft({ ...draft, nextGoal: e.target.value })}
              rows={3}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900 resize-none"
            />
            <p className="text-[10px] text-gray-400 mt-1">※抽象的な目標は避け、月末に振り返りやすいよう具体的に書きましょう</p>
          </div>

          <button onClick={handleSave} disabled={saving} className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
            {saving ? '送信中...' : '送信'}
          </button>
        </div>
      )}
    </div>
  );
}
