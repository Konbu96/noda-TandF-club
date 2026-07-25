import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Competition } from './types';

const COLLECTION = 'competitions';

export async function listCompetitions(): Promise<Competition[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy('date')));
  return snap.docs.map((d) => d.data() as Competition);
}

export async function saveCompetition(competition: Competition): Promise<void> {
  await setDoc(doc(db, COLLECTION, competition.id), competition);
}

export async function deleteCompetition(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
