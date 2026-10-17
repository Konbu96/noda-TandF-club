import { collection, deleteDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { PracticeDistance } from './practiceEvents';

const COLLECTION = 'practiceRecords';

export type PracticeRecord = {
  id: string;
  uid: string;
  displayName: string;
  distance: PracticeDistance;
  result: string;
  date: string; // YYYY-MM-DD
  attempt: number; // 同じ日・同じ距離の中で何本目か（30m/60mは1,2、80mは1）
};

// みんなの記録（日にちごとにまとめて見せる用。自分の分はこの中から絞り込む）
export async function getAllPracticeRecords(): Promise<PracticeRecord[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => d.data() as PracticeRecord);
}

export async function deletePracticeRecord(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// 日付・本人・距離・本数で1件に決まるIDにしておくと、同じ欄を直したときに重複せず上書きできる
function docId(entry: { uid: string; distance: PracticeDistance; date: string; attempt: number }): string {
  return `${entry.date}_${entry.uid}_${entry.distance}_${entry.attempt}`;
}

// 練習中は記録係が交代するため、誰でも誰の分でもまとめて保存・修正できる
export async function addPracticeRecords(
  entries: { uid: string; displayName: string; distance: PracticeDistance; result: string; date: string; attempt: number }[]
): Promise<void> {
  const batch = writeBatch(db);
  for (const entry of entries) {
    const ref = doc(db, COLLECTION, docId(entry));
    batch.set(ref, { id: ref.id, ...entry });
  }
  await batch.commit();
}
