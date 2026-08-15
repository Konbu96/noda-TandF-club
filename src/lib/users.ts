import { collection, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export type UserRole = 'teacher' | 'captain' | 'vice_captain' | 'manager' | 'block_leader' | 'member';

export type MemberRecord = {
  id: string;
  event: string;
  result: string;
  date: string;
  competition: string;
};

export type UserRecord = {
  uid: string;
  email: string;
  role: UserRole | null;
  displayName?: string;
  canEditMenu?: boolean;
  grade?: string;
  gender?: '男' | '女';
  block?: '短距離' | '中長距離' | '跳躍';
  event?: string;
  bibNumber?: string;
  restDay?: string;
  pb?: string;
  records?: MemberRecord[];
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

export async function getUser(uid: string): Promise<UserRecord | null> {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? (snap.data() as UserRecord) : null;
}

export async function updateUserProfile(uid: string, data: Partial<UserRecord>): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data);
}
