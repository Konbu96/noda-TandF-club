import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DailyMenu } from './types';

const COLLECTION = 'dailyMenus';

export async function getMenu(date: string): Promise<DailyMenu | null> {
  const snap = await getDoc(doc(db, COLLECTION, date));
  return snap.exists() ? (snap.data() as DailyMenu) : null;
}

export async function saveMenu(menu: DailyMenu): Promise<void> {
  await setDoc(doc(db, COLLECTION, menu.date), menu);
}

export async function listMenuDates(): Promise<string[]> {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => d.id);
}

export async function deleteMenu(date: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, date));
}
