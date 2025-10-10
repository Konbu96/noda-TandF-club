'use client';

import Image from 'next/image';

export default function Schedule() {
  return (
    <div id="schedule" className="py-4 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-3 text-center">スケジュール</h2>
        <div className="flex flex-col lg:flex-row lg:flex-row-reverse lg:items-stretch lg:gap-8">
          <div className="flex-1">
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
          <div className="flex-shrink-0 w-full lg:w-80 mt-4 lg:mt-0">
            <Image
              src="/img/image3.jpg"
              alt="陸上競技部のスケジュール"
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
