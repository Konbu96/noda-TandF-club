import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'managerGuide';
const DOC_ID = 'main';

// 初回（まだ何も保存されていない状態）にだけ使うデフォルトのセクション名。
// 保存後はマネージャーが自由にセクションを追加・削除・改名できる。
export const DEFAULT_GUIDE_SECTION_TITLES = ['アクティベーション', '動き作り'] as const;

export type GuideSection = { title: string; content: string };

export type ManagerGuide = {
  sections: GuideSection[];
  updatedBy: string;
  updatedAt: string;
};

export async function getManagerGuide(): Promise<ManagerGuide | null> {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  return snap.exists() ? (snap.data() as ManagerGuide) : null;
}

export async function saveManagerGuide(guide: ManagerGuide): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), guide);
}
