"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/member-app/auth/AuthContext";
import {
  getManagerGuide,
  saveManagerGuide,
  DEFAULT_GUIDE_SECTION_TITLES,
  GuideSection,
} from "./managerGuideService";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={open ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
      />
    </svg>
  );
}

const DEFAULT_CONTENT: Record<(typeof DEFAULT_GUIDE_SECTION_TITLES)[number], string> = {
  アクティベーション: `1. 四つん這いで片脚を90度に曲げて、片足裏を空に向けて動かす 左右15回づつ

2. ストレートレッグ 30m

3. 腕立て姿勢から脚を前後に深く入れ替えを早く 20回

4. ランジ（速く動かす） 30m

5. 四つん這い股関節回し 左右20回ずつ

6. 2ステップもも上げステップ30m

7. ランジ 20回

8. ギャロップ 30m

9. 雑巾掛け 20回

10. ギャロップ逆足 30m

11. 四つん這いの姿勢で膝をサイドに引き上げる 左右15回づつ

12. ハードルステップ 20m

13. カエル足20回

14. 横ステップ 30m

15. 腕立て姿勢から両腕・両足を1,2,3で開いて戻す 5往復

16. 大股歩行 20m

17. 腕立て・足上げ 20回

18. 1,2,3ランジ 10回`,
  動き作り: `1. 腕回しジョグ
・前20 後20 +前後20 前後の逆20
・右足先行サイド40（内回し20 外回し20） + 左足先行サイド40（内回し20 外回し20）

2. 足先タッチ
・対角20 同じ手足20 + 外回し20 ランジ20

3. 股関節回し
・前後ゆっくり20 ハードル跨ぎ20 + 前横早く20 + ハードル跨ぎ20

4. 重心移動
・歩き（交互）20 + リズム（交互）20
・右20 左20

5. バウンディング
・ゆっくり20 流し20 + 早く20 流し20

6. ギャロップ
・右40 + 左40

7. スキップ
・ゆっくり20 流し20 + 早く20 流し20

8. 片足スキップ
・右40 + 左40

9. 2ステップ + 1ステップ + 走り
・2ステップ10回 → 1ステップ10回 → 流し ×2本`,
};

function defaultSections(): GuideSection[] {
  return DEFAULT_GUIDE_SECTION_TITLES.map((title) => ({
    title,
    content: DEFAULT_CONTENT[title],
  }));
}

export default function ManagerGuideEditor() {
  const { user } = useAuth();
  const [sections, setSections] = useState<GuideSection[]>(defaultSections());
  const [draft, setDraft] = useState<GuideSection[]>(defaultSections());
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [expandedTitle, setExpandedTitle] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getManagerGuide()
      .then((guide) => setSections(guide ? guide.sections : defaultSections()))
      .finally(() => setLoading(false));
  }, []);

  const startEdit = () => {
    setDraft(sections);
    setNewTitle("");
    setNewContent("");
    setExpandedIndex(null);
    setIsEditing(true);
  };

  const updateDraftTitle = (index: number, title: string) =>
    setDraft((prev) => prev.map((s, i) => (i === index ? { ...s, title } : s)));

  const updateDraftContent = (index: number, content: string) =>
    setDraft((prev) => prev.map((s, i) => (i === index ? { ...s, content } : s)));

  const removeDraft = (index: number) => {
    setDraft((prev) => prev.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const withNew = newTitle.trim()
      ? [...draft, { title: newTitle.trim(), content: newContent }]
      : draft;
    const cleaned = withNew.filter((s) => s.title.trim());
    await saveManagerGuide({
      sections: cleaned,
      updatedBy: user.email ?? user.uid,
      updatedAt: new Date().toISOString(),
    });
    setSections(cleaned);
    setNewTitle("");
    setNewContent("");
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
    <div className="bg-white rounded-2xl card-shadow p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-blue-900">部活の準備の手順書</p>
        {!isEditing && (
          <button onClick={startEdit} className="text-xs text-blue-900">
            編集
          </button>
        )}
      </div>

      {isEditing ? (
        <>
          <div className="space-y-2">
            {draft.map((section, index) => {
              const isOpen = expandedIndex === index;
              return (
                <div key={index} className="border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    {isOpen ? (
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateDraftTitle(index, e.target.value)}
                        placeholder="セクション名"
                        autoFocus
                        className="flex-1 text-sm font-bold text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(index)}
                        className="flex-1 text-sm font-bold text-gray-800 text-left truncate"
                      >
                        {section.title || "（無題）"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                      className="p-1 text-gray-400 shrink-0"
                    >
                      <ChevronIcon open={isOpen} />
                    </button>
                  </div>

                  {isOpen && (
                    <div className="space-y-2 pt-3 mt-3 border-t border-gray-100">
                      <textarea
                        value={section.content}
                        onChange={(e) => updateDraftContent(index, e.target.value)}
                        rows={6}
                        className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
                      />
                      <button
                        onClick={() => removeDraft(index)}
                        className="text-xs text-red-500"
                      >
                        このセクションを削除
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-1">
            <p className="text-xs text-gray-500">セクションを追加</p>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="練習名（例: アップ）"
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="内容"
              rows={4}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-900"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditing(false);
                setNewTitle("");
                setNewContent("");
              }}
              className="flex-1 text-sm border border-gray-300 text-gray-600 py-2 rounded-xl"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 text-sm bg-blue-900 text-white py-2 rounded-xl disabled:opacity-50"
            >
              {saving ? "保存中..." : "保存"}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="divide-y">
            {sections.map((section) => {
              const isOpen = expandedTitle === section.title;
              return (
                <div key={section.title}>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedTitle(isOpen ? null : section.title)
                    }
                    className="w-full flex items-center justify-between py-2"
                  >
                    <span className="text-base font-bold text-gray-800">
                      {section.title}
                    </span>
                    <ChevronIcon open={isOpen} />
                  </button>
                  {isOpen && (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap pb-2">
                      {section.content || "まだ記入されていません"}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
