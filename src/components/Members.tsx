'use client';

import PieChart from './PieChart';

export default function Members() {
  return (
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
  );
}
