import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';

/**
 * ニュースアイテムの型定義
 */
export interface NewsItem {
  /** FirestoreのドキュメントID */
  docId: string;
  /** GoogleフォームのID */
  id: string;
  /** タイムスタンプ（文字列） */
  timestamp: string;
  /** 日付（文字列） */
  date: string;
  /** ニュース本文 */
  text: string;
}

/**
 * Firestoreのnewsコレクションからニュース一覧を取得する
 * @param limitCount 取得する件数（デフォルト: 100件）
 * @returns 日付の降順（新しい順）でソートされたニュース一覧
 */
export async function fetchNews(limitCount: number = 100): Promise<NewsItem[]> {
  const newsRef = collection(db, 'news');
  const q = query(newsRef, orderBy('date', 'desc'), limit(limitCount));
  
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => ({
    docId: doc.id,
    id: doc.data().id ?? '',
    timestamp: doc.data().timestamp ?? '',
    date: doc.data().date ?? '',
    text: doc.data().text ?? '',
  }));
}

/**
 * Firestoreからニュース一覧を取得する（トップページ用）
 * @param limitCount 取得する件数（デフォルト: 5件）
 */
export async function getNews(limitCount: number = 5): Promise<NewsItem[]> {
  return fetchNews(limitCount);
}
