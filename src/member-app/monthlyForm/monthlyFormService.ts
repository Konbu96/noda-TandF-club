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

const RELEASE_DAY = 25;

function nowInTokyo(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
}

// 25日になったら当月分に切り替わり、それより前は前月分をそのまま配信し続ける
function effectiveDate(): Date {
  const now = nowInTokyo();
  if (now.getDate() >= RELEASE_DAY) return now;
  return new Date(now.getFullYear(), now.getMonth() - 1, 1);
}

export function currentMonth(): string {
  const d = effectiveDate();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function currentMonthLabel(): string {
  return `${effectiveDate().getMonth() + 1}月`;
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
