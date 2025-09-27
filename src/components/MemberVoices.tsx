'use client';

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
    name: "鈴木さん",
    grade: "中2",
    event: "投擲",
    message: "技術的なことを丁寧に教えてもらえるので、どんどん上達しています。先生方も親身になってサポートしてくれます。"
  },
  {
    id: 5,
    name: "高橋さん",
    grade: "高2",
    event: "ハードル",
    message: "ハードルは技術が重要ですが、先輩たちのアドバイスでフォームが改善され、記録も伸びました。"
  },
  {
    id: 6,
    name: "伊藤さん",
    grade: "中1",
    event: "リレー",
    message: "リレーはチームワークが大切。バトンパスの練習を重ねて、みんなで一つの目標に向かって頑張っています。"
  }
];

export default function MemberVoices() {
  return (
    <div id="voices" className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">みんなの声</h2>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memberVoices.map((voice) => (
            <div key={voice.id} className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {voice.grade}
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">{voice.name}（{voice.grade}）</h3>
                  <p className="text-sm text-blue-700">{voice.event}</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                「{voice.message}」
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
