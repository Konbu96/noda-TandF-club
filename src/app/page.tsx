'use client';

import { useState } from 'react';
import Carousel from "../components/Carousel";
import ExperienceForm from "../components/ExperienceForm";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clickedCard, setClickedCard] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleCardClick = (cardType: string) => {
    setClickedCard(clickedCard === cardType ? null : cardType);
  };

  const handleCardHover = (cardType: string | null) => {
    setHoveredCard(cardType);
  };

  const handleFaqClick = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white text-center p-6 text-black">
      {/* スローガン - 一番上 */}
      <div className="py-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl mx-4 mb-8 shadow-lg">
        <div className="px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4 tracking-wide transform hover:scale-105 transition-transform duration-300">
            共に走り、共に強く
          </h1>
          <div className="w-80 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full shadow-md"></div>
        </div>
          </div>

      <div id="intro">
        <Carousel/>
      </div>

      <div id="news" className="p-4">
          <h2 className="">ニュース</h2>
          <ul>
            <li>2025</li>
            <li>2025</li>
            <li>2025</li>
          </ul>
        </div>

      <div id="schedule" className="p-4">
        <h2 className="text-2xl font-bold mb-4">スケジュール</h2>
        <div className="overflow-x-auto">
          <table className="w-full max-w-2xl mx-auto border-collapse border border-gray-300 rounded-lg text-sm">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="border border-gray-300 px-3 py-2 text-left">曜日</th>
                <th className="border border-gray-300 px-3 py-2 text-left">時間</th>
                <th className="border border-gray-300 px-3 py-2 text-left">場所</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">月曜日</td>
                <td className="border border-gray-300 px-3 py-2">15:30~</td>
                <td className="border border-gray-300 px-3 py-2">学校</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">火曜日</td>
                <td className="border border-gray-300 px-3 py-2">16:25~</td>
                <td className="border border-gray-300 px-3 py-2">学校</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">水曜日</td>
                <td className="border border-gray-300 px-3 py-2">15:50~</td>
                <td className="border border-gray-300 px-3 py-2">競技場</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">木曜日</td>
                <td className="border border-gray-300 px-3 py-2">16:25~</td>
                <td className="border border-gray-300 px-3 py-2">学校</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">金曜日</td>
                <td className="border border-gray-300 px-3 py-2">16:25~</td>
                <td className="border border-gray-300 px-3 py-2">学校</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">土曜日</td>
                <td className="border border-gray-300 px-3 py-2">13:50~</td>
                <td className="border border-gray-300 px-3 py-2">競技場</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-3 py-2 font-medium">日曜日</td>
                <td className="border border-gray-300 px-3 py-2">-</td>
                <td className="border border-gray-300 px-3 py-2">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div id="members" className="p-6">
        <h2 className="text-2xl font-bold mb-4">メンバー構成</h2>
        <div className="mx-auto max-w-3xl">
          {/* 円グラフ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 中高生比の円グラフ */}
            <div className="rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-bold mb-4 text-center">中高生比</h3>
              <div className="flex justify-center items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* 高校生 70% (14/20) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#1e40af"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.7} ${2 * Math.PI * 40}`}
                      strokeDashoffset="0"
                    />
                    {/* 中学生 30% (6/20) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.3} ${2 * Math.PI * 40}`}
                      strokeDashoffset={`-${2 * Math.PI * 40 * 0.7}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">20人</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-800 rounded-full mr-2"></div>
                  <span className="text-sm">高校生 14人</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm">中学生 6人</span>
                </div>
              </div>
            </div>

            {/* 男女比の円グラフ */}
            <div className="rounded-lg border border-gray-200 p-5">
              <h3 className="text-lg font-bold mb-4 text-center">男女比</h3>
              <div className="flex justify-center items-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* 男性 60% (12/20) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.6} ${2 * Math.PI * 40}`}
                      strokeDashoffset="0"
                    />
                    {/* 女性 40% (8/20) */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f472b6"
                      strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 40 * 0.4} ${2 * Math.PI * 40}`}
                      strokeDashoffset={`-${2 * Math.PI * 40 * 0.6}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">20人</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-400 rounded-full mr-2"></div>
                  <span className="text-sm">男性 12人</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-pink-400 rounded-full mr-2"></div>
                  <span className="text-sm">女性 8人</span>
                </div>
              </div>
            </div>
        </div>

          {/* 種目と活動の雰囲気 */}
          <div className="rounded-lg border border-gray-200 p-5 text-left mt-6">
            <p className="text-gray-700 mb-3">短距離から長距離、跳躍・投擲まで幅広く活動しています。</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">短距離</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">中長距離</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">ハードル</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">跳躍</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">投擲</span>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">リレー</span>
            </div>
          </div>
        </div>
      </div>

      {/* みんなの声 */}
      <div id="voices" className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">みんなの声</h2>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 部員の声1 */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  高2
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">田中さん（高2）</h3>
                  <p className="text-sm text-blue-700">短距離</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                「陸上部に入ってから体力がついて、勉強にも集中できるようになりました。みんなで目標に向かって頑張れる環境が最高です！」
              </p>
            </div>

            {/* 部員の声2 */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  中3
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">佐藤さん（中3）</h3>
                  <p className="text-sm text-blue-700">中長距離</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                「先輩たちが優しく教えてくれるので、初心者の私でも安心して練習できます。大会で自己ベストを更新できた時は本当に嬉しかったです。」
              </p>
            </div>

            {/* 部員の声3 */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  高1
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">山田さん（高1）</h3>
                  <p className="text-sm text-blue-700">跳躍</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                「陸上競技は個人競技だと思っていましたが、チーム一丸となって応援し合える仲間ができて、毎日の練習が楽しみです。」
              </p>
            </div>

            {/* 部員の声4 */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  中2
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">鈴木さん（中2）</h3>
                  <p className="text-sm text-blue-700">投擲</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                「技術的なことを丁寧に教えてもらえるので、どんどん上達しています。先生方も親身になってサポートしてくれます。」
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* よくある質問 */}
      <div id="faq" className="p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-6 text-center">よくある質問</h2>
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {/* FAQ 1 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => handleFaqClick(0)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                  陸上競技の経験がなくても入部できますか？
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === 0 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === 0 && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 ml-9">
                    はい、大丈夫です！多くの部員が初心者からスタートしています。基礎から丁寧に指導しますので、安心してご参加ください。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => handleFaqClick(1)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                  練習はどのくらいの頻度で行われますか？
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === 1 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === 1 && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 ml-9">
                    平日は週4日、土曜日も練習があります。日曜日は基本的に休みですが、大会前などは調整練習を行う場合があります。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => handleFaqClick(2)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                  勉強との両立は可能ですか？
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === 2 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === 2 && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 ml-9">
                    はい、可能です！練習時間は限られているので、効率的に時間を使う習慣が身につきます。部員の多くが勉強も頑張っています。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => handleFaqClick(3)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                  必要な道具や費用はありますか？
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === 3 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === 3 && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 ml-9">
                    基本的にはシューズとウェアが必要です。学校指定のものもありますが、最初は体験入部で様子を見ていただいても構いません。
                  </p>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => handleFaqClick(4)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">Q</span>
                  大会への参加は必須ですか？
                </h3>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    openFaq === 4 ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openFaq === 4 && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 ml-9">
                    参加は強制ではありませんが、目標を持つことで練習のモチベーションが上がります。自分のペースで参加できる大会を選べます。
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div id="experience-form" className="p-4">
        <ExperienceForm />
      </div>

      {/* ページトップボタン */}
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            // メインコンテンツエリアをスクロール
            const mainElement = document.querySelector('main');
            if (mainElement) {
              mainElement.scrollTo({ top: 0, behavior: 'smooth' });
            }
            // 念のためwindowもスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-blue-900 text-white rounded-full shadow-lg hover:bg-blue-600 hover:scale-110 transition-all duration-200 z-50 flex items-center justify-center"
        aria-label="ページトップへ"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}  