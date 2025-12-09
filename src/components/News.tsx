import Image from 'next/image';
import { getNews, NewsItem } from '@/lib/news';

export default async function News() {
  let newsItems: NewsItem[] = [];
  let error: string | null = null;

  try {
    newsItems = await getNews(5);
  } catch (e) {
    console.error('Failed to fetch news:', e);
    error = 'ニュースの取得に失敗しました';
  }

  return (
    <div id="news" className="py-2 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-bold mb-2 text-center lg:text-xl lg:mb-3">ニュース</h2>
        <p className="text-center text-gray-700 mb-4 text-sm lg:text-base">部活動の最新ニュースです</p>
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-8">
          <div className="flex-1">
            <div className="max-w-6xl mx-auto">
              {error ? (
                <p className="text-center text-red-500">{error}</p>
              ) : newsItems.length === 0 ? (
                <p className="text-center text-gray-500">ニュースはまだありません</p>
              ) : (
                <dl className="text-left space-y-1 lg:space-y-0">
                  {newsItems.map((item, index) => (
                    <div
                      key={item.id}
                      className={`${index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-50'} p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4`}
                    >
                      <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">
                        {item.date}
                      </dt>
                      <dd className="text-xs lg:text-sm">{item.text}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-80 mt-4 lg:mt-0">
            <Image
              src="/img/image1.jpg"
              alt="陸上競技部の練習"
              width={320}
              height={240}
              className="shadow-lg object-cover w-full h-64 lg:h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
