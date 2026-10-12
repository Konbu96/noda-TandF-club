import { collection, deleteDoc, doc, getDocs, query, setDoc, where, writeBatch } from 'firebase/firestore';
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
};

// 練習では同じ日に同じ距離を何本も測ることがあるため、ドキュメントIDは自動採番にする
export async function getMyPracticeRecords(uid: string): Promise<PracticeRecord[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('uid', '==', uid)));
  return snap.docs.map((d) => d.data() as PracticeRecord);
}

// みんなの記録（日にちごとにまとめて見せる用）
export async function getAllPracticeRecords(): Promise<PracticeRecord[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => d.data() as PracticeRecord);
}

export async function addPracticeRecord(
  uid: string,
  displayName: string,
  distance: PracticeDistance,
  result: string,
  date: string
): Promise<void> {
  const ref = doc(collection(db, COLLECTION));
  await setDoc(ref, { id: ref.id, uid, displayName, distance, result, date });
}

export async function deletePracticeRecord(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

// 競技場で複数人の記録をまとめて保存する（出席者一括入力用）
export async function addPracticeRecords(
  entries: { uid: string; displayName: string; distance: PracticeDistance; result: string; date: string }[]
): Promise<void> {
  const batch = writeBatch(db);
  for (const entry of entries) {
    const ref = doc(collection(db, COLLECTION));
    batch.set(ref, { id: ref.id, ...entry });
  }
  await batch.commit();
}
