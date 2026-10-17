import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'stadiumFeeSettings';

// 競技場使用料が冬季料金かどうかを日付ごとに持つ（誰が見ても同じ金額になるよう共有で保存する）
export async function getWinterFlag(date: string): Promise<boolean> {
  const snap = await getDoc(doc(db, COLLECTION, date));
  return snap.exists() ? !!snap.data().winter : false;
}

export async function setWinterFlag(date: string, winter: boolean): Promise<void> {
  await setDoc(doc(db, COLLECTION, date), { date, winter });
}
