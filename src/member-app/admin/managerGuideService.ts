import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'managerGuide';
const DOC_ID = 'main';

export const GUIDE_SECTION_TITLES = ['アクティベーション', '動き作り'] as const;

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
