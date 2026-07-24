import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { DailyMenu } from './types';

export async function getMenu(date: string): Promise<DailyMenu | null> {
  const snap = await getDoc(doc(db, 'dailyMenus', date));
  return snap.exists() ? (snap.data() as DailyMenu) : null;
}

export async function saveMenu(menu: DailyMenu): Promise<void> {
  await setDoc(doc(db, 'dailyMenus', menu.date), menu);
}
