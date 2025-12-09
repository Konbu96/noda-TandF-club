import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

export interface NewsItem {
  id: string;
  date: string;
  text: string;
}

/**
 * Firestoreからニュース一覧を取得する
 * @param limitCount 取得する件数（デフォルト: 10件）
 */
export async function getNews(limitCount: number = 10): Promise<NewsItem[]> {
  const newsRef = collection(db, 'news');
  const q = query(newsRef, orderBy('date', 'desc'), limit(limitCount));
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    date: doc.data().date,
    text: doc.data().text,
  }));
}

