import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'teacher' | 'captain' | 'vice_captain' | 'manager' | 'block_leader' | 'member';

export type UserRecord = {
  uid: string;
  email: string;
  role: UserRole | null;
  displayName?: string;
  canEditMenu?: boolean;
};

// 表示・並び替えの基準となる役職順（顧問→キャプテン→副キャプテン→マネージャー→ブロック長→部員）
export const ROLE_LABELS: Record<UserRole, string> = {
  teacher: '先生',
  captain: 'キャプテン',
  vice_captain: '副キャプテン',
  manager: 'マネージャー',
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
