import Image from 'next/image';
import ExperienceForm from "../components/ExperienceForm";
import MemberVoices from "../components/MemberVoices";
import FAQ from "../components/FAQ";
import Schedule from "../components/Schedule";
import Members from "../components/Members";
import News from "../components/News";
import ScrollToTopButton from "../components/ScrollToTopButton";

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
        <News />

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
      <ScrollToTopButton />
    </div>
  );
}
