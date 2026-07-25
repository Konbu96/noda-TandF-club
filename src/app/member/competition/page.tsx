'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { Competition } from '@/member-app/competition/types';
import { deleteCompetition, listCompetitions, saveCompetition } from '@/member-app/competition/competitionService';
import EntryEditor from '@/member-app/competition/EntryEditor';

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyCompetition(): Competition {
  return { id: newId(), name: '', date: '', location: '', entries: [], updatedBy: '', updatedAt: '' };
}

function sortByDate(list: Competition[]): Competition[] {
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
    </svg>
  );
}

export default function CompetitionPage() {
  const { user, canEditMenu } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Competition | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    listCompetitions()
      .then(setCompetitions)
      .finally(() => setLoading(false));
  }, []);

  const startCreate = () => {
    setCreating(true);
    setDraft(emptyCompetition());
  };

  const cancelCreate = () => {
    setCreating(false);
    setDraft(null);
  };

  const startEdit = (competition: Competition) => {
    setEditingId(competition.id);
    setDraft(competition);
    setExpandedId(competition.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const handleSaveNew = async () => {
    if (!user || !draft) return;
    setSaving(true);
    const toSave: Competition = { ...draft, updatedBy: user.email ?? user.uid, updatedAt: new Date().toISOString() };
    await saveCompetition(toSave);
    setCompetitions((prev) => sortByDate([...prev, toSave]));
    setSaving(false);
    setCreating(false);
    setDraft(null);
  };

  const handleSaveEdit = async () => {
    if (!user || !draft) return;
    setSaving(true);
    const toSave: Competition = { ...draft, updatedBy: user.email ?? user.uid, updatedAt: new Date().toISOString() };
    await saveCompetition(toSave);
    setCompetitions((prev) => sortByDate(prev.map((c) => (c.id === toSave.id ? toSave : c))));
    setSaving(false);
    setEditingId(null);
    setDraft(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('この大会を削除しますか？')) return;
    await deleteCompetition(id);
    setCompetitions((prev) => prev.filter((c) => c.id !== id));
    if (expandedId === id) setExpandedId(null);
    if (editingId === id) {
      setEditingId(null);
      setDraft(null);
    }
  };

  const renderForm = () => {
    if (!draft) return null;
    return (
      <div className="space-y-2">
        <input
          type="text"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="大会名"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <input
          type="date"
          value={draft.date}
          onChange={(e) => setDraft({ ...draft, date: e.target.value })}
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <input
          type="text"
          value={draft.location}
          onChange={(e) => setDraft({ ...draft, location: e.target.value })}
          placeholder="場所"
          className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
        />
        <p className="text-xs font-bold text-blue-900 pt-1">エントリー</p>
        <EntryEditor entries={draft.entries} onChange={(entries) => setDraft({ ...draft, entries })} />
      </div>
    );
  };

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="text-sm text-gray-500">大会</div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {canEditMenu && !creating && (
            <button
              onClick={startCreate}
              className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl"
            >
              ＋大会を追加
            </button>
          )}

          {creating && (
            <div className="bg-white rounded-2xl shadow p-4 space-y-3">
              {renderForm()}
              <div className="flex gap-2">
                <button onClick={cancelCreate} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
                  キャンセル
                </button>
                <button onClick={handleSaveNew} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
                  {saving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          )}

          {competitions.length === 0 && !creating ? (
            <p className="text-sm text-gray-400 text-center py-4">大会はまだ登録されていません</p>
          ) : (
            <div className="space-y-2">
              {competitions.map((competition) => {
                const isOpen = expandedId === competition.id;
                const isEditingThis = editingId === competition.id;
                const entries = competition.entries.filter((e) => e.event);
                return (
                  <div key={competition.id} className="bg-white rounded-2xl shadow p-4">
                    <button
                      type="button"
                      onClick={() => setExpandedId(isOpen ? null : competition.id)}
                      className="w-full flex items-center gap-3 text-left"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{competition.name || '（無題）'}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {competition.date.replace(/-/g, '/')}　{competition.location}
                        </p>
                      </div>
                      <span className="text-gray-300">
                        <ChevronIcon open={isOpen} />
                      </span>
                    </button>

                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {isEditingThis ? (
                          <div className="space-y-3">
                            {renderForm()}
                            <div className="flex gap-2">
                              <button onClick={cancelEdit} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
                                キャンセル
                              </button>
                              <button onClick={handleSaveEdit} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
                                {saving ? '保存中...' : '保存'}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            {entries.length === 0 ? (
                              <p className="text-xs text-gray-400">エントリーはまだありません</p>
                            ) : (
                              <ul className="space-y-1">
                                {entries.map((entry) => (
                                  <li key={entry.uid} className="text-sm text-gray-800 flex justify-between">
                                    <span>{entry.displayName}</span>
                                    <span className="text-gray-500">{entry.event}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                            {canEditMenu && (
                              <div className="flex gap-2 mt-3">
                                <button
                                  onClick={() => startEdit(competition)}
                                  className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl"
                                >
                                  編集
                                </button>
                                <button
                                  onClick={() => handleDelete(competition.id)}
                                  className="flex-1 text-sm border border-red-200 text-red-500 py-2 rounded-xl"
                                >
                                  削除
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
