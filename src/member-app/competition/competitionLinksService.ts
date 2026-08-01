import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CompetitionLink } from './types';

const COLLECTION = 'competitionLinks';
const DOC_ID = 'main';

export async function getCompetitionLinks(): Promise<CompetitionLink[]> {
  const snap = await getDoc(doc(db, COLLECTION, DOC_ID));
  return snap.exists() ? ((snap.data().links as CompetitionLink[]) ?? []) : [];
}

export async function saveCompetitionLinks(links: CompetitionLink[]): Promise<void> {
  await setDoc(doc(db, COLLECTION, DOC_ID), { links });
}
