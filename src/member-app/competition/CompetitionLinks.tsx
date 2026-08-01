'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { CompetitionLink } from './types';
import { getCompetitionLinks, saveCompetitionLinks } from './competitionLinksService';

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function LinkIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5M10.172 13.828a4 4 0 010-5.656l3-3a4 4 0 015.656 5.656l-1.5 1.5" />
    </svg>
  );
}

export default function CompetitionLinks() {
  const { canEditMenu } = useAuth();
  const [links, setLinks] = useState<CompetitionLink[]>([]);
  const [draft, setDraft] = useState<CompetitionLink[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getCompetitionLinks()
      .then(setLinks)
      .catch((e) => {
        console.error('リンクの読み込みに失敗しました', e);
        setError('リンクの読み込みに失敗しました');
      })
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraft(links);
    setIsEditing(true);
  };

  const updateDraft = (id: string, field: 'title' | 'url', value: string) =>
    setDraft((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));

  const addDraft = () => setDraft((prev) => [...prev, { id: newId(), title: '', url: '' }]);
  const removeDraft = (id: string) => setDraft((prev) => prev.filter((l) => l.id !== id));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const cleaned = draft.filter((l) => l.title.trim() && l.url.trim());
    try {
      await saveCompetitionLinks(cleaned);
      setLinks(cleaned);
      setIsEditing(false);
    } catch (e) {
      console.error('リンクの保存に失敗しました', e);
      setError('保存に失敗しました。時間をおいて再度お試しください');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div className="w-5 h-5 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isEditing && links.length === 0 && !canEditMenu) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold text-blue-900 tracking-wide">リンク</p>
        {canEditMenu && !isEditing && (
          <button onClick={startEdit} className="text-xs text-blue-900">
            編集
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <div className="space-y-2">
            {draft.map((link) => (
              <div key={link.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateDraft(link.id, 'title', e.target.value)}
                    placeholder="リンク名（例: 速報）"
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateDraft(link.id, 'url', e.target.value)}
                    placeholder="https://..."
                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
                  />
                </div>
                <button onClick={() => removeDraft(link.id)} className="text-xs text-red-500 px-2 py-2">
                  削除
                </button>
              </div>
            ))}
          </div>
          <button onClick={addDraft} className="w-full text-sm border border-dashed border-gray-300 text-gray-500 py-2 rounded-xl">
            ＋リンクを追加
          </button>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
              キャンセル
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </>
      ) : links.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-2">まだリンクがありません</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 bg-sky-50 rounded-xl py-3 px-1 text-center"
            >
              <span className="text-blue-900">
                <LinkIcon />
              </span>
              <span className="text-xs font-medium text-gray-700 leading-tight">{link.title}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
