import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION = 'stadiumAttendance';

export type AttendanceLocation = '競技場' | '学校';

export type AttendanceEntry = {
  uid: string;
  displayName: string;
  date: string; // YYYY-MM-DD
  location: AttendanceLocation;
};

// 1人1日1件になるよう、ドキュメントIDを日付とuidから決める
function docId(date: string, uid: string): string {
  return `${date}_${uid}`;
}

export async function getAttendanceForDate(date: string): Promise<AttendanceEntry[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('date', '==', date)));
  return snap.docs.map((d) => d.data() as AttendanceEntry);
}

export async function setAttendance(
  uid: string,
  displayName: string,
  date: string,
  location: AttendanceLocation
): Promise<void> {
  await setDoc(doc(db, COLLECTION, docId(date, uid)), { uid, displayName, date, location });
}
