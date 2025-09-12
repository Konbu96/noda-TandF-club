'use client';

import { useState } from 'react';
import Carousel from "../components/Carousel";
import ExperienceForm from "../components/ExperienceForm";

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
    <div className="bg-white text-center p-6 text-black">
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

      <div id="schedule" className="p-4 list-none">
        <h2>スケジュール</h2>
        <li>月曜日</li>
        <li>火曜日</li>
        <li>水曜日</li>
        <li>木曜日</li>
        <li>金曜日</li>
        <li>土曜日</li>
        <li>日曜日</li>
      </div>

      <div id="members" className="p-6">
        <h2 className="text-2xl font-bold mb-4">メンバー</h2>
        <div className="mx-auto max-w-3xl">
          {/* ステータスカード */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">合計</p>
              <p className="text-2xl font-extrabold">20人</p>
            </div>
            
            {/* 高校生カード */}
            <div 
              className="rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
              onClick={() => handleCardClick('highschool')}
              onMouseEnter={() => handleCardHover('highschool')}
              onMouseLeave={() => handleCardHover(null)}
            >
              <p className="text-sm text-gray-500">高校生</p>
              <p className="text-2xl font-extrabold">14人</p>
              
              {/* ホバー/クリック時の詳細表示 */}
              {(hoveredCard === 'highschool' || clickedCard === 'highschool') && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                  <div className="text-left">
                    <p className="font-semibold text-sm mb-2">高校生内訳</p>
                    <ul className="space-y-1 text-sm">
                      <li>高２：<span className="font-semibold">5人</span></li>
                      <li>高１：<span className="font-semibold">9人</span></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {/* 中学生カード */}
            <div 
              className="rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 transition-colors relative"
              onClick={() => handleCardClick('middleschool')}
              onMouseEnter={() => handleCardHover('middleschool')}
              onMouseLeave={() => handleCardHover(null)}
            >
              <p className="text-sm text-gray-500">中学生</p>
              <p className="text-2xl font-extrabold">6人</p>
              
              {/* ホバー/クリック時の詳細表示 */}
              {(hoveredCard === 'middleschool' || clickedCard === 'middleschool') && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10">
                  <div className="text-left">
                    <p className="font-semibold text-sm mb-2">中学生内訳</p>
                    <ul className="space-y-1 text-sm">
                      <li>中３：<span className="font-semibold">2人</span></li>
                      <li>中２：<span className="font-semibold">3人</span></li>
                      <li>中１：<span className="font-semibold">1人</span></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 種目と活動の雰囲気 */}
          <div className="rounded-lg border border-gray-200 p-5 text-left">
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

          {/* 体験導線 */}
          <div className="mt-6">
            <a href="#experience-form" className="inline-block bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors">体験入部の申し込みはこちら</a>
          </div>
        </div>
      </div>

      <div id="experience-form" className="p-4">
        <ExperienceForm />
      </div>
    </div>
  );
}  