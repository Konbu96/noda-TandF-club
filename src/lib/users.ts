import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'teacher' | 'manager' | 'captain' | 'block_leader' | 'member';

export type UserRecord = {
  uid: string;
  email: string;
  role: UserRole | null;
  displayName?: string;
};

export const ROLE_LABELS: Record<UserRole, string> = {
  teacher: '先生',
  manager: 'マネージャー',
  captain: 'キャプテン',
  block_leader: 'ブロック長',
  member: '部員',
};

export async function getAllUsers(): Promise<UserRecord[]> {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map((d) => d.data() as UserRecord);
}

export async function updateUserRole(uid: string, role: UserRole | null): Promise<void> {
  await updateDoc(doc(db, 'users', uid), { role });
}
