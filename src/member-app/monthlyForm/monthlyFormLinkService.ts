import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'monthlyFormLink';
const DOC_ID = 'main';

export async function getMonthlyFormLink(): Promise<string> {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  return snap.exists() ? ((snap.data().url as string) ?? '') : '';
}

export async function saveMonthlyFormLink(url: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), { url });
}
