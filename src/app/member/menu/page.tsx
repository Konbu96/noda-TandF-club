'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/member-app/auth/AuthContext';
import { TEMPLATES, CATEGORIES, TEMPLATE_SPECS, MenuCategory, MenuItem } from '@/member-app/menu/types';
import { getMenu, saveMenu } from '@/member-app/menu/menuService';
import ItemOptions from '@/member-app/menu/ItemOptions';
import CustomItemOptions from '@/member-app/menu/CustomItemOptions';

function today() {
  return new Date().toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
}

function newId() {
  return Math.random().toString(36).slice(2, 9);
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
    </svg>
  );
}

export default function MenuPage() {
  const { user, canEditMenu } = useAuth();
  const [date] = useState(today);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [teacherNote, setTeacherNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const defaultItems = (): MenuItem[] =>
    TEMPLATES.map((t) => ({ id: newId(), title: t.title, checked: false, note: '', isCustom: false, category: t.category }));

  const mergeWithTemplates = (saved: MenuItem[]): MenuItem[] => {
    const hasCategories = saved.some((i) => i.category);
    if (hasCategories) return saved;
    return TEMPLATES.map((t) => {
      const match = saved.find((s) => s.title === t.title);
      return { id: newId(), title: t.title, checked: match?.checked ?? false, note: match?.note ?? '', isCustom: false, category: t.category };
    });
  };

  useEffect(() => {
    setLoading(true);
    getMenu(date)
      .then((menu) => {
        if (menu) {
          setItems(mergeWithTemplates(menu.items));
          setTeacherNote(menu.teacherNote ?? '');
        } else {
          setItems(defaultItems());
          setTeacherNote('');
        }
      })
      .catch(() => {
        setItems(defaultItems());
        setTeacherNote('');
      })
      .finally(() => {
        setIsEditing(false);
        setExpandedId(null);
        setLoading(false);
      });
  }, [date]);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, checked: !item.checked } : item));

  const updateNote = (id: string, note: string) =>
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, note } : item));

  const displayNote = (item: MenuItem) => {
    const customNote = (item.customOptions?.filter((o) => o.selected) ?? []).map((o) => o.label).join('＆');
    return [item.note, customNote].filter(Boolean).join('　');
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    await saveMenu({ date, items, teacherNote, updatedBy: user.email ?? user.uid, updatedAt: new Date().toISOString() });
    setSaving(false);
    setIsEditing(false);
    setExpandedId(null);
  };

  const itemsByCategory = (category: MenuCategory) => items.filter((i) => i.category === category);
  const checkedByCategory = (category: MenuCategory) => items.filter((i) => i.category === category && i.checked);
  const hasAnyChecked = items.some((i) => i.checked);

  return (
    <div className="px-4 py-6 space-y-4">
      <div className="text-sm text-gray-500">{date.replace(/-/g, '/')} のメニュー</div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow p-4 space-y-4">
            {isEditing ? (
              CATEGORIES.map((category) => (
                <div key={category}>
                  <p className="text-xs font-bold text-blue-900 mb-2 tracking-wide">{category}</p>
                  <div className="space-y-0.5">
                    {itemsByCategory(category).map((item) => {
                      const spec = TEMPLATE_SPECS[item.title];
                      const isOpen = expandedId === item.id;
                      return (
                        <div key={item.id}>
                          <div className="flex items-center gap-3 py-1.5">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggle(item.id)}
                              className="w-5 h-5 accent-blue-900 shrink-0"
                            />
                            <span className="flex-1 text-sm text-gray-800">
                              {item.title}{displayNote(item) ? `（${displayNote(item)}）` : ''}
                            </span>
                              <button
                              type="button"
                              onClick={() => setExpandedId(isOpen ? null : item.id)}
                              className={`p-1 rounded transition-colors ${isOpen ? 'text-blue-900' : 'text-gray-300'}`}
                            >
                              <ChevronIcon open={isOpen} />
                            </button>
                          </div>
                          {isOpen && (
                            <>
                              {spec && (
                                <ItemOptions
                                  spec={spec}
                                  onChange={(note) => updateNote(item.id, note)}
                                />
                              )}
                              <CustomItemOptions
                                options={item.customOptions ?? []}
                                onChange={(opts, note) =>
                                  setItems((prev) =>
                                    prev.map((i) =>
                                      i.id === item.id
                                        ? { ...i, customOptions: opts, note: spec ? i.note : note }
                                        : i
                                    )
                                  )
                                }
                              />

                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : !hasAnyChecked ? (
              <p className="text-sm text-gray-400 text-center py-4">本日のメニューは未設定です</p>
            ) : (
              CATEGORIES.map((category) => {
                const checked = checkedByCategory(category);
                if (checked.length === 0) return null;
                return (
                  <div key={category}>
                    <p className="text-xs font-bold text-blue-900 mb-1 tracking-wide">{category}</p>
                    <ul className="space-y-1">
                      {checked.map((item) => (
                        <li key={item.id} className="flex items-start gap-2 text-sm text-gray-800">
                          <span className="mt-0.5 text-blue-900">•</span>
                          <span>{item.title}{displayNote(item) ? `（${displayNote(item)}）` : ''}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>

          {isEditing ? (
            <div className="bg-white rounded-2xl shadow p-4 space-y-2">
              <p className="text-sm font-medium text-blue-900">追加事項</p>
              <textarea
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                placeholder="部員全員に向けたメモを入力..."
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-1 focus:ring-blue-900"
                rows={3}
              />
            </div>
          ) : teacherNote ? (
            <div className="bg-white rounded-2xl shadow p-4">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{teacherNote}</p>
            </div>
          ) : null}

          {canEditMenu && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <button onClick={() => { setIsEditing(false); setExpandedId(null); }} className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl">
                    キャンセル
                  </button>
                  <button onClick={handleSave} disabled={saving} className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50">
                    {saving ? '保存中...' : '保存'}
                  </button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl">
                  編集
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
