import Link from 'next/link';
import { fetchNews, NewsItem } from '@/lib/news';

export const metadata = {
  title: 'ニュース一覧 | 野田学園陸上競技部',
  description: '野田学園陸上競技部の最新ニュース一覧',
};

export default async function NewsPage() {
  let newsItems: NewsItem[] = [];
  let error: string | null = null;

  try {
    newsItems = await fetchNews();
  } catch (e) {
    console.error('Failed to fetch news:', e);
    error = 'ニュースの取得に失敗しました';
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-blue-900 text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/" className="text-sm hover:underline mb-2 inline-block">
            ← トップページへ戻る
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold">ニュース一覧</h1>
          <p className="text-blue-200 mt-1">野田学園陸上競技部の最新情報</p>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : newsItems.length === 0 ? (
          <div className="bg-gray-100 text-gray-600 px-4 py-8 rounded text-center">
            ニュースはまだありません
          </div>
        ) : (
          <div className="space-y-4">
            {newsItems.map((item) => (
              <article
                key={item.docId}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                {/* 日付とID */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <time className="text-blue-900 font-semibold">{item.date}</time>
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                    ID: {item.docId}
                  </span>
                </div>

                {/* 本文 */}
                <p className="text-gray-800 leading-relaxed">{item.text}</p>

                {/* メタ情報 */}
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                  <div className="flex flex-wrap gap-4">
                    {item.timestamp && (
                      <span>タイムスタンプ: {item.timestamp}</span>
                    )}
                    {item.id && (
                      <span>フォームID: {item.id}</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 件数表示 */}
        {newsItems.length > 0 && (
          <p className="text-center text-gray-500 mt-8">
            全 {newsItems.length} 件のニュース
          </p>
        )}
      </main>

      {/* フッター */}
      <footer className="bg-gray-100 py-6 text-center text-xs text-gray-500">
        <p>&copy; Noda Track and Field Club</p>
      </footer>
    </div>
  );
}

