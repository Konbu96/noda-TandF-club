'use client';

import Image from 'next/image';

interface MemberVoice {
  id: number;
  name: string;
  grade: string;
  event: string;
  message: string;
}

const memberVoices: MemberVoice[] = [
  {
    id: 1,
    name: "門出",
    grade: "高2",
    event: "短距離",
    message: "先輩たちのアドバイスでフォームが改善されて、記録も伸びました。"
  },
  {
    id: 2,
    name: "岡本",
    grade: "中3",
    event: "中長距離",
    message: "体力がついて勉強にも集中できるようになりました。"
  },
  {
    id: 3,
    name: "村田",
    grade: "高1",
    event: "跳躍",
    message: "先生が幅跳びを専門的に教えてくださるので、技術が向上しています。"
  },
  {
    id: 4,
    name: "加藤",
    grade: "高2",
    event: "ハードル",
    message: "競技場での練習もできるので、本格的な環境で競技に取り組めます。"
  }
];

// 種目別アイコン
const getEventIcon = (event: string) => {
  switch (event) {
    case "短距離":
      return (
        <Image
          src="/icons/short.png"
          alt="短距離"
          width={40}
          height={40}
          className="w-6 h-6 md:w-10 md:h-10 filter brightness-0 invert"
        />
      );
    case "中長距離":
      return (
        <Image
          src="/icons/long.png"
          alt="中長距離"
          width={40}
          height={40}
          className="w-6 h-6 md:w-10 md:h-10 filter brightness-0 invert"
        />
      );
    case "跳躍":
      return (
        <Image
          src="/icons/long-jump.png"
          alt="跳躍"
          width={40}
          height={40}
          className="w-6 h-6 md:w-10 md:h-10 filter brightness-0 invert"
        />
      );
    case "投擲":
      return (
        <Image
          src="/icons/shot-put.png"
          alt="砲丸投げ"
          width={32}
          height={32}
          className="w-6 h-6 md:w-8 md:h-8 filter brightness-0 invert"
        />
      );
    case "ハードル":
      return (
        <Image
          src="/icons/hurdle.png"
          alt="ハードル"
          width={40}
          height={40}
          className="w-6 h-6 md:w-10 md:h-10 filter brightness-0 invert"
        />
      );
    case "リレー":
      return (
        <Image
          src="/icons/relay.png"
          alt="リレー"
          width={32}
          height={32}
          className="w-6 h-6 md:w-8 md:h-8 filter brightness-0 invert"
        />
      );
    default:
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

export default function MemberVoices() {
  return (
    <div id="voices" className="py-6 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-3 text-center">みんなの声</h2>
        <div className="flex flex-col lg:flex-row lg:flex-row-reverse lg:items-stretch lg:gap-8">
          <div className="flex-1">
            <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2 lg:gap-3">
          {memberVoices.map((voice) => (
            <div key={voice.id} className="bg-blue-50 p-2 lg:p-6 rounded-lg border border-blue-200">
              <div className="flex items-start mb-2 lg:mb-3">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mr-2 lg:mr-4 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 lg:w-10 lg:h-10">
                    {getEventIcon(voice.event)}
                  </div>
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-blue-900 text-sm lg:text-lg">{voice.name}</h3>
                  <p className="text-xs md:text-sm text-blue-600">{voice.event}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-left text-xs lg:text-base">
                {voice.message}
              </p>
            </div>
          ))}
        </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-80 mt-4 lg:mt-0">
            <Image
              src="/img/image4.png"
              alt="陸上競技部の練習風景"
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
