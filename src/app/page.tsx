'use client';

import { useState } from 'react';
import Image from 'next/image';
import ExperienceForm from "../components/ExperienceForm";
import MemberVoices from "../components/MemberVoices";
import FAQ from "../components/FAQ";
import PieChart from "../components/PieChart";

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [clickedCard, setClickedCard] = useState<string | null>(null);

  const handleCardClick = (cardType: string) => {
    setClickedCard(clickedCard === cardType ? null : cardType);
  };

  const handleCardHover = (cardType: string | null) => {
    setHoveredCard(cardType);
  };

  return (
    <div className="text-center text-black text-sm">
      {/* 固定背景画像 */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/img/image1.jpg"
          alt="野田学園陸上競技部"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* ヒーローセクション */}
      <div id="intro" className="relative w-full h-screen sm:h-[80vh] md:h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-4 drop-shadow-lg font-serif" style={{ fontFamily: 'var(--font-noto-serif-jp)' }}>
            野田学園陸上競技部
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl drop-shadow-md font-serif font-bold" style={{ fontFamily: 'var(--font-noto-serif-jp)' }}>
            共に走り、共に強く
          </p>
        </div>
      </div>

      {/* フェードインエリア（ヒーローからニュースまで） */}
      <div 
        className="relative z-10 h-32 sm:h-40 md:h-48"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 20%, rgba(255,255,255,0.3) 40%, rgba(255,255,255,0.8) 70%, rgba(255,255,255,1) 100%)'
        }}
      ></div>

      {/* コンテンツエリア */}
      <div className="relative z-10 bg-white">
        <div id="news" className="py-4 px-4">
          <h2 className="text-xl font-bold mb-3 text-center">ニュース</h2>
          <ul className="text-left">
            <li className="text-sm bg-blue-100 p-2">2025年10月3日〜10月7日　第79回 国民スポーツ大会</li>
            <li className="text-sm bg-blue-50 p-2">2025年10月11日〜10月12日　令和７年度　中国高等学校新人陸上競技対校選手権大会</li>
            <li className="text-sm bg-blue-100 p-2">2025年10月17日〜10月19日　第56回 U16陸上競技大会</li>
          </ul>
        </div>

        <div id="schedule" className="py-4 px-4">
          <h2 className="text-xl font-bold mb-3">スケジュール</h2>
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

        <div id="members" className="py-4 px-4">
          <h2 className="text-xl font-bold mb-3">メンバー構成</h2>
        <div className="mx-auto max-w-3xl">
          {/* 円グラフ */}
          <div className="grid grid-cols-2 gap-2 md:gap-6">
            <PieChart
              title="中高生比"
              total={20}
              segments={[
                { label: '高校生', value: 14, color: '#1e40af', percentage: 0.7 },
                { label: '中学生', value: 6, color: '#3b82f6', percentage: 0.3 }
              ]}
            />
            <PieChart
              title="男女比"
              total={20}
              segments={[
                { label: '男性', value: 12, color: '#60a5fa', percentage: 0.6 },
                { label: '女性', value: 8, color: '#f472b6', percentage: 0.4 }
              ]}
            />
        </div>

                  {/* 種目と活動の雰囲気 */}
                  <div className="rounded-lg border border-gray-200 p-5 text-left mt-2 md:mt-6">
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

        <MemberVoices />

        <FAQ />

        <div id="experience-form" className="py-4 px-4">
          <ExperienceForm />
        </div>
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