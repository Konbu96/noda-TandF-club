'use client';

import { useState } from 'react';
import Image from 'next/image';
import ExperienceForm from "../components/ExperienceForm";
import MemberVoices from "../components/MemberVoices";
import FAQ from "../components/FAQ";
import Schedule from "../components/Schedule";
import Members from "../components/Members";

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
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-4 drop-shadow-lg tracking-wider font-serif">
            野田学園陸上競技部
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl drop-shadow-md font-bold font-serif">
            共に走り、共に強く
          </p>
        </div>
      </div>

      {/* フェードインエリア（ヒーローからニュースまで） */}
      <div className="relative z-10 h-32 sm:h-40 md:h-48 bg-gradient-to-b from-transparent via-white/30 to-white"></div>

      {/* コンテンツエリア */}
      <div className="relative z-10 bg-white">
        {/* セクション1: ニュース */}
        <div className="py-2 px-4 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
              {/* 写真 */}
              <div className="order-1 md:order-1 md:pr-4">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <Image
                    src="/img/image2.jpg"
                    alt="ニュース"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* コンテンツ */}
              <div className="order-2 md:order-2" id="news">
                <h2 className="text-lg font-bold mb-2 text-center md:text-xl md:mb-3">ニュース</h2>
                <dl className="text-left space-y-1 md:space-y-0">
                  <div className="bg-blue-100 p-1 md:p-2 flex flex-col md:flex-row md:gap-4">
                    <dt className="text-xs md:text-sm font-semibold md:w-48 md:flex-shrink-0">2025年10月3日〜10月7日</dt>
                    <dd className="text-xs md:text-sm">第79回 国民スポーツ大会</dd>
                  </div>
                  <div className="bg-blue-50 p-1 md:p-2 flex flex-col md:flex-row md:gap-4">
                    <dt className="text-xs md:text-sm font-semibold md:w-48 md:flex-shrink-0">2025年10月11日〜10月12日</dt>
                    <dd className="text-xs md:text-sm">令和７年度　中国高等学校新人陸上競技対校選手権大会</dd>
                  </div>
                  <div className="bg-blue-100 p-1 md:p-2 flex flex-col md:flex-row md:gap-4">
                    <dt className="text-xs md:text-sm font-semibold md:w-48 md:flex-shrink-0">2025年10月17日〜10月19日</dt>
                    <dd className="text-xs md:text-sm">第56回 U16陸上競技大会</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* セクション2: スケジュール */}
        <div className="py-4 px-4 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
              {/* 写真 */}
              <div className="order-1 md:order-2 md:pl-4">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <Image
                    src="/img/image3.jpg"
                    alt="スケジュール"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* コンテンツ */}
              <div className="order-2 md:order-1" id="schedule">
                <Schedule />
              </div>
            </div>
          </div>
        </div>

        {/* セクション3: メンバー */}
        <div className="py-4 px-4 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
              {/* 写真 */}
              <div className="order-1 md:order-1 md:pr-4">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <Image
                    src="/img/image4.jpg"
                    alt="メンバー"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* コンテンツ */}
              <div className="order-2 md:order-2" id="members">
                <Members />
              </div>
            </div>
          </div>
        </div>

        {/* セクション4: みんなの声 */}
        <div className="py-6 px-4 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
              {/* 写真 */}
              <div className="order-1 md:order-2 md:pl-4">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <Image
                    src="/img/image1.jpg"
                    alt="みんなの声"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              {/* コンテンツ */}
              <div className="order-2 md:order-1" id="voices">
                <MemberVoices />
              </div>
            </div>
          </div>
        </div>

        {/* セクション5: よくある質問 */}
        <div className="py-6 px-4 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div id="faq">
              <FAQ />
            </div>
          </div>
        </div>

        {/* セクション6: 体験入部申し込み */}
        <div className="py-4 px-4 md:py-8">
          <div className="max-w-6xl mx-auto">
            <div id="experience-form">
              <ExperienceForm />
            </div>
          </div>
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