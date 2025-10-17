'use client';

import Image from 'next/image';
import ExperienceForm from "../components/ExperienceForm";
import MemberVoices from "../components/MemberVoices";
import FAQ from "../components/FAQ";
import Schedule from "../components/Schedule";
import Members from "../components/Members";

export default function Home() {
  return (
    <div className="text-center text-black text-sm">
      {/* 固定背景画像 */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/img/main.jpg"
          alt="野田学園陸上競技部"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* ヒーローセクション */}
      <div id="intro" className="relative w-full h-screen lg:h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-3xl lg:text-6xl font-black mb-4 drop-shadow-lg tracking-wider font-serif">
            野田学園陸上競技部
          </h1>
          <p className="text-lg lg:text-2xl drop-shadow-md font-bold font-serif">
            共に走り、共に強く
          </p>
        </div>
      </div>

      {/* フェードインエリア（ヒーローからニュースまで） */}
      <div className="relative z-10 h-32 lg:h-48 bg-gradient-to-b from-transparent via-white/30 to-white"></div>

      {/* コンテンツエリア */}
      <div className="relative z-10 bg-white px-4 lg:px-0">
        <div id="news" className="py-2 lg:py-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-bold mb-2 text-center lg:text-xl lg:mb-3">ニュース</h2>
            <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-8">
              <div className="flex-1">
            <dl className="text-left space-y-1 lg:space-y-0">
              <div className="bg-blue-100 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年10月25日〜10月26日</dt>
                <dd className="text-xs lg:text-sm">高校秋季県大会</dd>
              </div>
              <div className="bg-blue-50 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年10月17日〜10月19日</dt>
                <dd className="text-xs lg:text-sm">第56回 U16陸上競技大会</dd>
              </div>
              <div className="bg-blue-100 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年10月11日〜10月12日</dt>
                <dd className="text-xs lg:text-sm">令和７年度　中国高等学校新人陸上競技対校選手権大会</dd>
              </div>
              <div className="bg-blue-50 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年10月3日〜10月7日</dt>
                <dd className="text-xs lg:text-sm">第79回 国民スポーツ大会</dd>
              </div>
              <div className="bg-blue-100 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年9月20日〜9月21日</dt>
                <dd className="text-xs lg:text-sm">山口県高等学校新人競技選手権大会で3名が中国高校新人大会への出場権を獲得しました。</dd>
              </div>
            </dl>
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

        <Schedule />

        <Members />

        <MemberVoices />

        <FAQ />

        <div id="experience-form" className="py-4 lg:py-8">
          <ExperienceForm />
        </div>

        {/* フッター */}
        <footer className="py-8 text-center text-xs text-gray-500">
          <p>&copy; Noda Track and Field Club</p>
        </footer>
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