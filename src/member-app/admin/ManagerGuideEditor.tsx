'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { getManagerGuide, saveManagerGuide } from './managerGuideService';

export default function ManagerGuideEditor() {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [draft, setDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getManagerGuide()
      .then((guide) => setContent(guide?.content ?? ''))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraft(content);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await saveManagerGuide({ content: draft, updatedBy: user.email ?? user.uid, updatedAt: new Date().toISOString() });
    setContent(draft);
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
    <div className="bg-white rounded-2xl shadow p-4 space-y-3">
      <p className="text-sm font-bold text-blue-900">部活の準備の手順書</p>
      {isEditing ? (
        <>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={12}
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
          />
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
              キャンセル
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        </>
      ) : (
        <>
          {content ? (
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{content}</p>
          ) : (
            <p className="text-sm text-gray-400">まだ手順書がありません</p>
          )}
          <button onClick={startEdit} className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl">
            編集
          </button>
        </>
      )}
    </div>
  );
}
