import { collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'monthlyForms';

export type MonthlyFormAnswers = {
  name: string;
  lastMonthGoal: string;
  achievementLevel: string; // '1'〜'5'
  reflection: string;
  nextGoal: string;
};

export type MonthlyFormEntry = MonthlyFormAnswers & {
  uid: string;
  month: string; // "YYYY-MM"
  updatedAt: string;
};

export function currentMonth(): string {
  return new Date()
    .toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit' })
    .replace(/\//g, '-');
}

function docId(uid: string, month: string): string {
  return `${uid}_${month}`;
}

export async function getMonthlyForm(uid: string, month: string): Promise<MonthlyFormEntry | null> {
  const snap = await getDoc(doc(db, COLLECTION, docId(uid, month)));
  return snap.exists() ? (snap.data() as MonthlyFormEntry) : null;
}

export async function getMonthlyFormsForMonth(month: string): Promise<MonthlyFormEntry[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('month', '==', month)));
  return snap.docs.map((d) => d.data() as MonthlyFormEntry);
}

export async function saveMonthlyForm(uid: string, month: string, answers: MonthlyFormAnswers): Promise<void> {
  await setDoc(doc(db, COLLECTION, docId(uid, month)), {
    uid,
    month,
    ...answers,
    updatedAt: new Date().toISOString(),
  });
}
