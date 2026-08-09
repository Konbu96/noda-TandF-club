import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'moods';

export type MoodEntry = {
  uid: string;
  displayName: string;
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

export async function getMoodsForDate(date: string): Promise<MoodEntry[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('date', '==', date)));
  return snap.docs.map((d) => d.data() as MoodEntry);
}

export async function saveTodayMood(uid: string, displayName: string, date: string, mood: string): Promise<void> {
  await setDoc(doc(db, COLLECTION, docId(uid, date)), {
    uid,
    displayName,
    date,
    mood,
    updatedAt: new Date().toISOString(),
  });
}
