'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { Competition } from '@/member-app/competition/types';
import { deleteCompetition, listCompetitions, saveCompetition } from '@/member-app/competition/competitionService';
import EventSelector from '@/member-app/competition/EventSelector';
import EntryEventEditor from '@/member-app/competition/EntryEventEditor';
import CompetitionLinks from '@/member-app/competition/CompetitionLinks';

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function emptyCompetition(): Competition {
  return { id: newId(), name: '', date: '', location: '', entries: [], updatedBy: '', updatedAt: '' };
}

function sortByDate(list: Competition[]): Competition[] {
  return [...list].sort((a, b) => a.date.localeCompare(b.date));
}

const LOCATION_PRESETS = ['補助競技場', 'みらいふ'];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

export default function CompetitionPage() {
  const { user, role, canEditMenu } = useAuth();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Competition | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customLocation, setCustomLocation] = useState(false);
  const [editingEntryUid, setEditingEntryUid] = useState<string | null>(null);

  useEffect(() => {
    listCompetitions()
      .then(setCompetitions)
      .finally(() => setLoading(false));
  }, []);

  const startCreate = () => {
    setCreating(true);
    setDraft(emptyCompetition());
    setCustomLocation(false);
  };

  const cancelCreate = () => {
    setCreating(false);
    setDraft(null);
  };

  const startEdit = (competition: Competition) => {
    setEditingId(competition.id);
    setDraft(competition);
    setExpandedId(competition.id);
    setCustomLocation(!LOCATION_PRESETS.includes(competition.location));
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

  const handleEntriesChange = async (competition: Competition, entries: Competition['entries']) => {
    if (!user) return;
    const toSave: Competition = { ...competition, entries, updatedBy: user.email ?? user.uid, updatedAt: new Date().toISOString() };
    await saveCompetition(toSave);
    setCompetitions((prev) => prev.map((c) => (c.id === toSave.id ? toSave : c)));
  };

  const toggleEntriesClosed = async (competition: Competition) => {
    if (!user) return;
    const toSave: Competition = {
      ...competition,
      entriesClosed: !competition.entriesClosed,
      updatedBy: user.email ?? user.uid,
      updatedAt: new Date().toISOString(),
    };
    await saveCompetition(toSave);
    setCompetitions((prev) => prev.map((c) => (c.id === toSave.id ? toSave : c)));
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
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {LOCATION_PRESETS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  setDraft({ ...draft, location: loc });
                  setCustomLocation(false);
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  !customLocation && draft.location === loc
                    ? 'bg-sky-100 text-sky-700 border-sky-300'
                    : 'bg-white text-gray-600 border-gray-300'
                }`}
              >
                {loc}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                if (LOCATION_PRESETS.includes(draft.location)) {
                  setDraft({ ...draft, location: '' });
                }
                setCustomLocation(true);
              }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                customLocation
                  ? 'bg-sky-100 text-sky-700 border-sky-300'
                  : 'bg-white text-gray-600 border-gray-300'
              }`}
            >
              その他
            </button>
          </div>
          {customLocation && (
            <input
              type="text"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              placeholder="場所を入力"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
          )}
        </div>
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
          <CompetitionLinks />

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
                const entries = competition.entries.filter((e) => e.events && e.events.length > 0);
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
                                  <li key={entry.uid}>
                                    <div className="text-sm text-gray-800 flex items-center justify-between gap-2">
                                      <span className="flex-1 truncate">{entry.displayName}</span>
                                      <span className="text-gray-500">{entry.events.join('・')}</span>
                                      {role === 'teacher' && (
                                        <button
                                          onClick={() =>
                                            setEditingEntryUid(editingEntryUid === entry.uid ? null : entry.uid)
                                          }
                                          className="text-gray-400 p-1 shrink-0"
                                        >
                                          <PencilIcon />
                                        </button>
                                      )}
                                    </div>
                                    {role === 'teacher' && editingEntryUid === entry.uid && (
                                      <EntryEventEditor
                                        events={entry.events}
                                        onCancel={() => setEditingEntryUid(null)}
                                        onSave={async (events) => {
                                          const rest = competition.entries.filter((e) => e.uid !== entry.uid);
                                          const next =
                                            events.length > 0
                                              ? [...rest, { uid: entry.uid, displayName: entry.displayName, events }]
                                              : rest;
                                          await handleEntriesChange(competition, next);
                                          setEditingEntryUid(null);
                                        }}
                                      />
                                    )}
                                  </li>
                                ))}
                              </ul>
                            )}

                            {role !== 'teacher' && role !== 'manager' && (
                              competition.entriesClosed ? (
                                <p className="text-xs text-gray-400 pt-3 mt-3 border-t border-gray-100">
                                  エントリーは締め切られました
                                </p>
                              ) : (
                                <EventSelector
                                  entries={competition.entries}
                                  onChange={(next) => handleEntriesChange(competition, next)}
                                />
                              )
                            )}

                            {role === 'teacher' && (
                              <button
                                onClick={() => toggleEntriesClosed(competition)}
                                className="w-full text-sm border border-gray-300 text-gray-600 py-2 rounded-xl mt-3"
                              >
                                {competition.entriesClosed ? 'エントリーを再開する' : 'エントリーを締め切る'}
                              </button>
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
