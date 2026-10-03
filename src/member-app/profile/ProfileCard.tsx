'use client';

import { ReactNode, useState } from 'react';
import { getSpecialtyEvents, MemberRecord, UserRecord } from '@/lib/users';
import { COMPETITION_EVENTS } from '@/member-app/competition/types';
import MemberBasicInfo from './MemberBasicInfo';

const GENDERS = ['男', '女'] as const;
const BLOCKS = ['短距離', '中長距離', '跳躍'] as const;

export default function ProfileCard({
  profile,
  moodAvatar,
  records,
  onSave,
  editableName,
  initialEditing,
}: {
  profile: UserRecord;
  moodAvatar?: ReactNode;
  records?: MemberRecord[];
  onSave: (data: Partial<UserRecord>) => Promise<void>;
  editableName?: boolean;
  initialEditing?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(!!initialEditing);
  const [draft, setDraft] = useState<Partial<UserRecord>>(profile);
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft({ ...profile, specialtyEvents: getSpecialtyEvents(profile) });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const specialtyEvents = getSpecialtyEvents(draft);
    await onSave({ ...draft, specialtyEvents, event: specialtyEvents[0] ?? '' });
    setSaving(false);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="relative bg-white rounded-2xl card-shadow p-5">
        <button onClick={startEdit} className="absolute top-5 right-5 text-xs text-blue-900">
          編集
        </button>
        <MemberBasicInfo profile={profile} moodAvatar={moodAvatar} records={records} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-3">
      {editableName && (
        <div>
          <label className="block text-xs text-gray-500 mb-1">名前</label>
          <input
            type="text"
            value={draft.displayName ?? ''}
            onChange={(e) => setDraft({ ...draft, displayName: e.target.value })}
            placeholder="例: 野田 太郎"
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
        </div>
      )}

      <div>
        <label className="block text-xs text-gray-500 mb-1">学年</label>
        <input
          type="text"
          value={draft.grade ?? ''}
          onChange={(e) => setDraft({ ...draft, grade: e.target.value })}
          placeholder="例: 高校2年"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">性別</label>
        <div className="flex gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setDraft({ ...draft, gender: g })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                draft.gender === g ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">所属ブロック</label>
        <div className="flex gap-2">
          {BLOCKS.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setDraft({ ...draft, block: b })}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                draft.block === b ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">専門種目（複数選択できます）</label>
        <div className="flex flex-wrap gap-2">
          {COMPETITION_EVENTS.map((ev) => {
            const selected = getSpecialtyEvents(draft).includes(ev);
            return (
              <button
                key={ev}
                type="button"
                onClick={() => {
                  const current = getSpecialtyEvents(draft);
                  const next = selected ? current.filter((e) => e !== ev) : [...current, ev];
                  setDraft({ ...draft, specialtyEvents: next, event: next[0] ?? '' });
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selected ? 'bg-sky-100 text-sky-700 border-sky-300' : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {ev}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">ゼッケン番号</label>
        <input
          type="text"
          value={draft.bibNumber ?? ''}
          onChange={(e) => setDraft({ ...draft, bibNumber: e.target.value })}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">定期休養</label>
        <input
          type="text"
          value={draft.restDay ?? ''}
          onChange={(e) => setDraft({ ...draft, restDay: e.target.value })}
          placeholder="例: 水曜日"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
      </div>

      <p className="text-xs text-gray-400">
        PBは大会ページで入力した記録から自動で計算されるため、ここでの入力は不要です。
      </p>

      <div className="flex gap-2">
        <button onClick={() => setIsEditing(false)} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
          キャンセル
        </button>
        <button onClick={handleSave} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
