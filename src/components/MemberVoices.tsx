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
    name: "田中さん",
    grade: "高2",
    event: "短距離",
    message: "陸上部に入ってから体力がついて、勉強にも集中できるようになりました。みんなで目標に向かって頑張れる環境が最高です！"
  },
  {
    id: 2,
    name: "佐藤さん",
    grade: "中3",
    event: "中長距離",
    message: "先輩たちが優しく教えてくれるので、初心者の私でも安心して練習できます。大会で自己ベストを更新できた時は本当に嬉しかったです。"
  },
  {
    id: 3,
    name: "山田さん",
    grade: "高1",
    event: "跳躍",
    message: "陸上競技は個人競技だと思っていましたが、チーム一丸となって応援し合える仲間ができて、毎日の練習が楽しみです。"
  },
  {
    id: 4,
    name: "高橋さん",
    grade: "高2",
    event: "ハードル",
    message: "ハードルは技術が重要ですが、先輩たちのアドバイスでフォームが改善され、記録も伸びました。"
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
          width={24}
          height={24}
          className="w-6 h-6 filter brightness-0 invert"
        />
      );
    case "中長距離":
      return (
        <Image
          src="/icons/long.png"
          alt="中長距離"
          width={24}
          height={24}
          className="w-6 h-6 filter brightness-0 invert"
        />
      );
    case "跳躍":
      return (
        <Image
          src="/icons/long-jump.png"
          alt="跳躍"
          width={24}
          height={24}
          className="w-6 h-6 filter brightness-0 invert"
        />
      );
    case "投擲":
      return (
        <Image
          src="/icons/shot-put.png"
          alt="砲丸投げ"
          width={24}
          height={24}
          className="w-6 h-6 filter brightness-0 invert"
        />
      );
    case "ハードル":
      return (
        <Image
          src="/icons/hurdle.png"
          alt="ハードル"
          width={24}
          height={24}
          className="w-6 h-6 filter brightness-0 invert"
        />
      );
    case "リレー":
      return (
        <Image
          src="/icons/relay.png"
          alt="リレー"
          width={24}
          height={24}
          className="w-6 h-6 filter brightness-0 invert"
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
    <div id="voices" className="py-6">
      <h2 className="text-xl font-bold mb-3 text-center">みんなの声</h2>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
          {memberVoices.map((voice) => (
            <div key={voice.id} className="bg-blue-50 p-2 md:p-6 rounded-lg border border-blue-200">
              <div className="flex items-start mb-2 md:mb-3">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white mr-2 md:mr-4 flex-shrink-0">
                  <div className="flex items-center justify-center w-6 h-6 md:w-8 md:h-8">
                    {getEventIcon(voice.event)}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 text-xs md:text-base">{voice.name}（{voice.grade}）</h3>
                  <p className="text-xs text-blue-700 mt-1">{voice.event}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed text-left text-xs md:text-base">
                「{voice.message}」
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
