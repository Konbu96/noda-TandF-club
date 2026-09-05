'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getMonthlyFormLink, saveMonthlyFormLink } from './monthlyFormLinkService';

export default function MonthlyFormCard() {
  const { role } = useAuth();
  const canEditLink = role === 'captain' || role === 'vice_captain';

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getMonthlyFormLink()
      .then(setUrl)
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraft(url);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveMonthlyFormLink(draft.trim());
    setUrl(draft.trim());
    setSaving(false);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-blue-900">月末フォーム</p>
        {canEditLink && !isEditing && (
          <button onClick={startEdit} className="text-xs text-blue-900">
            リンクを編集
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="https://docs.google.com/forms/..."
            className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
              キャンセル
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </div>
      ) : url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center text-sm bg-blue-900 text-white py-2 rounded-xl"
        >
          月末フォームを開く →
        </a>
      ) : (
        <p className="text-sm text-gray-400">まだリンクが設定されていません</p>
      )}
    </div>
  );
}
