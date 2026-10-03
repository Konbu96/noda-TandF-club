'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/member-app/auth/AuthContext';
import { today } from '@/member-app/menu/dateUtils';
import { Competition } from '@/member-app/competition/types';
import { deleteCompetition, listCompetitions, saveCompetition } from '@/member-app/competition/competitionService';
import EventSelector from '@/member-app/competition/EventSelector';
import EntryEventEditor from '@/member-app/competition/EntryEventEditor';
import EntryRecordEditor from '@/member-app/competition/EntryRecordEditor';
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

// 大会の日付から1週間経ったら「過去の大会」として扱う
function isPastCompetition(date: string): boolean {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return false;
  const cutoff = new Date(y, m - 1, d + 7);
  const [ty, tm, td] = today().split('-').map(Number);
  return cutoff <= new Date(ty, tm - 1, td);
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
  const { user, role } = useAuth();
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Competition | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customLocation, setCustomLocation] = useState(false);
  const [editingEntryUid, setEditingEntryUid] = useState<string | null>(null);
  const [editingEntryRecordUid, setEditingEntryRecordUid] = useState<string | null>(null);
  const [showPast, setShowPast] = useState(false);

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
    router.refresh();
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
    router.refresh();
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
    router.refresh();
  };

  const handleEntriesChange = async (competition: Competition, entries: Competition['entries']) => {
    if (!user) return;
    const toSave: Competition = { ...competition, entries, updatedBy: user.email ?? user.uid, updatedAt: new Date().toISOString() };
    await saveCompetition(toSave);
    setCompetitions((prev) => prev.map((c) => (c.id === toSave.id ? toSave : c)));
    router.refresh();
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

  const renderCompetitionCard = (competition: Competition, isPast = false) => {
    const isOpen = expandedId === competition.id;
    const isEditingThis = editingId === competition.id;
    const entries = competition.entries.filter((e) => e.events && e.events.length > 0);
    return (
          <div
            key={competition.id}
            className={isPast ? 'pt-3 first:pt-0 border-t first:border-t-0 border-gray-100' : 'bg-white rounded-2xl card-shadow p-4'}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : competition.id)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="text-sm font-medium text-gray-800">{competition.name || '（無題）'}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {competition.date.replace(/-/g, '/')}　{competition.location}
                </p>
              </button>
              {role === 'teacher' && !isEditingThis && (
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(competition)}
                    className="text-xs text-blue-900"
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(competition.id)}
                    className="text-xs text-red-500"
                  >
                    削除
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={() => setExpandedId(isOpen ? null : competition.id)}
                className="text-gray-300 shrink-0"
              >
                <ChevronIcon open={isOpen} />
              </button>
            </div>

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
                              <span className="text-gray-500">
                                {entry.events
                                  .map((ev) => (entry.results?.[ev] ? `${ev}(${entry.results[ev]})` : ev))
                                  .join(' / ')}
                              </span>
                              {!isPast && role === 'teacher' && (
                                <button
                                  onClick={() => {
                                    setEditingEntryRecordUid(null);
                                    setEditingEntryUid(editingEntryUid === entry.uid ? null : entry.uid);
                                  }}
                                  className="text-gray-400 p-1 shrink-0"
                                >
                                  <PencilIcon />
                                </button>
                              )}
                              {(role === 'teacher' || role === 'manager') && (
                                <button
                                  onClick={() => {
                                    setEditingEntryUid(null);
                                    setEditingEntryRecordUid(
                                      editingEntryRecordUid === entry.uid ? null : entry.uid
                                    );
                                  }}
                                  className="text-xs text-blue-900 shrink-0"
                                >
                                  記録を編集
                                </button>
                              )}
                            </div>
                            {!isPast && role === 'teacher' && editingEntryUid === entry.uid && (
                              <EntryEventEditor
                                events={entry.events}
                                onCancel={() => setEditingEntryUid(null)}
                                onSave={async (events) => {
                                  const rest = competition.entries.filter((e) => e.uid !== entry.uid);
                                  const filteredResults = entry.results
                                    ? Object.fromEntries(
                                        Object.entries(entry.results).filter(([ev]) => events.includes(ev))
                                      )
                                    : {};
                                  const updatedEntry = {
                                    uid: entry.uid,
                                    displayName: entry.displayName,
                                    events,
                                    ...(Object.keys(filteredResults).length > 0 ? { results: filteredResults } : {}),
                                  };
                                  const next = events.length > 0 ? [...rest, updatedEntry] : rest;
                                  await handleEntriesChange(competition, next);
                                  setEditingEntryUid(null);
                                }}
                              />
                            )}
                            {(role === 'teacher' || role === 'manager') && editingEntryRecordUid === entry.uid && (
                              <EntryRecordEditor
                                events={entry.events}
                                results={entry.results}
                                onCancel={() => setEditingEntryRecordUid(null)}
                                onSave={async (results) => {
                                  const rest = competition.entries.filter((e) => e.uid !== entry.uid);
                                  const updatedEntry = {
                                    uid: entry.uid,
                                    displayName: entry.displayName,
                                    events: entry.events,
                                    ...(Object.keys(results).length > 0 ? { results } : {}),
                                  };
                                  await handleEntriesChange(competition, [...rest, updatedEntry]);
                                  setEditingEntryRecordUid(null);
                                }}
                              />
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {!isPast && role !== 'teacher' && role !== 'manager' && (
                      <EventSelector
                        entries={competition.entries}
                        competitionDate={competition.date}
                        onChange={(next) => handleEntriesChange(competition, next)}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
    );
  };

  const upcoming = competitions.filter((c) => !isPastCompetition(c.date));
  const past = competitions.filter((c) => isPastCompetition(c.date));

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

          {role === 'teacher' && !creating && (
            <button
              onClick={startCreate}
              className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl"
            >
              ＋大会を追加
            </button>
          )}

          {creating && (
            <div className="bg-white rounded-2xl card-shadow p-4 space-y-3">
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
            <>
              {upcoming.length > 0 && (
                <div className="space-y-2">{upcoming.map((c) => renderCompetitionCard(c))}</div>
              )}

              {past.length > 0 && (
                <div className="bg-white rounded-2xl card-shadow p-4">
                  <button
                    type="button"
                    onClick={() => setShowPast(!showPast)}
                    className="w-full flex items-center justify-between text-sm text-gray-500"
                  >
                    <span>過去の大会（{past.length}）</span>
                    <ChevronIcon open={showPast} />
                  </button>
                  {showPast && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {past.map((c) => renderCompetitionCard(c, true))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
