import { collection, deleteDoc, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MemberRecord } from '@/lib/users';
import { Competition } from './types';

const COLLECTION = 'competitions';

export async function listCompetitions(): Promise<Competition[]> {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy('date')));
  return snap.docs.map((d) => d.data() as Competition);
}

// 大会エントリーに自分で入力した記録を、日付順のグラフ用データとして取り出す
export async function getMemberRecords(uid: string): Promise<MemberRecord[]> {
  const competitions = await listCompetitions();
  const records: MemberRecord[] = [];
  for (const competition of competitions) {
    const mine = competition.entries.find((e) => e.uid === uid);
    if (!mine?.results) continue;
    for (const [event, result] of Object.entries(mine.results)) {
      if (!result) continue;
      records.push({
        id: `${competition.id}_${event}`,
        event,
        result,
        date: competition.date,
        competition: competition.name,
      });
    }
  }
  return records.sort((a, b) => a.date.localeCompare(b.date));
}

export async function saveCompetition(competition: Competition): Promise<void> {
  await setDoc(doc(db, COLLECTION, competition.id), competition);
}

export async function deleteCompetition(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
