'use client';

import { useState } from 'react';
import { MemberRecord } from '@/lib/users';
import RecordGraph from './RecordGraph';

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyRecord(): MemberRecord {
  return { id: newId(), event: '', result: '', date: '', competition: '' };
}

export default function RecordsCard({
  records,
  event,
  onSave,
}: {
  records: MemberRecord[];
  event: string;
  onSave: (records: MemberRecord[]) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<MemberRecord[]>(records);
  const [newRecord, setNewRecord] = useState<MemberRecord>(emptyRecord());
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft(records);
    setNewRecord(emptyRecord());
    setIsEditing(true);
  };

  const removeDraft = (id: string) => setDraft((prev) => prev.filter((r) => r.id !== id));

  const addDraft = () => {
    if (!newRecord.event.trim() || !newRecord.result.trim() || !newRecord.date.trim() || !newRecord.competition.trim()) return;
    setDraft((prev) => [...prev, { ...newRecord, id: newId() }]);
    setNewRecord(emptyRecord());
  };

  const handleSave = async () => {
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow p-5 space-y-3">
        <RecordGraph records={records} event={event} />
        <button onClick={startEdit} className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl">
          記録を編集
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <p className="text-sm font-bold text-blue-900">記録一覧</p>

      {draft.length > 0 && (
        <div className="divide-y">
          {draft.map((r) => (
            <div key={r.id} className="flex items-center gap-2 py-2">
              <div className="flex-1 min-w-0 text-sm text-gray-800">
                {r.date}　{r.competition}　{r.event}　{r.result}
              </div>
              <button onClick={() => removeDraft(r.id)} className="text-xs text-red-500 px-2 py-1 shrink-0">
                削除
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2 pt-1">
        <p className="text-xs text-gray-500">記録を追加</p>
        <input
          type="text"
          value={newRecord.event}
          onChange={(e) => setNewRecord({ ...newRecord, event: e.target.value })}
          placeholder="種目（例: 100m）"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <input
          type="text"
          value={newRecord.result}
          onChange={(e) => setNewRecord({ ...newRecord, result: e.target.value })}
          placeholder="記録（例: 11.03）"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <input
          type="text"
          value={newRecord.date}
          onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
          placeholder="日付（例: 04/19(日)）"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <input
          type="text"
          value={newRecord.competition}
          onChange={(e) => setNewRecord({ ...newRecord, competition: e.target.value })}
          placeholder="大会名（例: 春季大会）"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <button
          onClick={addDraft}
          disabled={!newRecord.event.trim() || !newRecord.result.trim() || !newRecord.date.trim() || !newRecord.competition.trim()}
          className="w-full text-sm border border-dashed border-gray-300 text-gray-500 py-2 rounded-xl disabled:opacity-50"
        >
          ＋追加
        </button>
      </div>

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
