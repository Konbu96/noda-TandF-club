import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'moods';

export type MoodEntry = {
  uid: string;
  date: string;
  mood: string;
  updatedAt: string;
};

function docId(uid: string, date: string): string {
  return `${uid}_${date}`;
}

export async function getTodayMood(uid: string, date: string): Promise<MoodEntry | null> {
  const snap = await getDoc(doc(db, COLLECTION, docId(uid, date)));
  return snap.exists() ? (snap.data() as MoodEntry) : null;
}

export async function saveTodayMood(uid: string, date: string, mood: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, docId(uid, date)), {
    uid,
    date,
    mood,
    updatedAt: new Date().toISOString(),
  });
}
