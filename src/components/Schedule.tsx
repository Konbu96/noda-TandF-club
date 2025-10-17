'use client';

import Image from 'next/image';

export default function Schedule() {
  const schedule = [
    { id: 1, day: '月', time: '15:30~', location: '学校' },
    { id: 2, day: '火', time: '16:25~', location: '学校' },
    { id: 3, day: '水', time: '15:50~', location: '競技場' },
    { id: 4, day: '木', time: '16:25~', location: '学校' },
    { id: 5, day: '金', time: '16:25~', location: '学校' },
    { id: 6, day: '土', time: '13:50~', location: '競技場' },
    { id: 7, day: '日', time: '-', location: '休み', isHoliday: true },
  ];

  return (
    <div id="schedule" className="py-4 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-3 text-center">スケジュール</h2>
        <div className="flex flex-col lg:flex-row lg:flex-row-reverse lg:items-stretch lg:gap-8">
          <div className="flex-1">
            {/* スマホ版：4列と3列のグリッド */}
            <div className="lg:hidden space-y-3">
              {/* 1段目：月〜木 */}
              <div className="grid grid-cols-4 gap-3">
                {schedule.slice(0, 4).map((item) => (
                  <div 
                    key={item.id} 
                    className="bg-blue-50 border border-blue-200 p-2 rounded-lg text-center flex flex-col justify-center aspect-square"
                  >
                    <div className="text-base font-bold mb-1 text-blue-900">
                      {item.day}
                    </div>
                    <div className="text-sm text-gray-700">{item.time}</div>
                    <div className="text-sm text-gray-600">{item.location}</div>
                  </div>
                ))}
              </div>

              {/* 2段目：金〜日（中央揃え） */}
              <div className="flex justify-center gap-3">
                {schedule.slice(4).map((item) => (
                  <div 
                    key={item.id} 
                    className={`p-2 rounded-lg border text-center flex flex-col justify-center aspect-square w-[calc(25%-0.5rem)] ${
                      item.isHoliday 
                        ? 'bg-gray-50 border-gray-300' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className={`text-base font-bold mb-1 ${
                      item.isHoliday ? 'text-gray-700' : 'text-blue-900'
                    }`}>
                      {item.day}
                    </div>
                    <div className="text-sm text-gray-700">{item.time}</div>
                    <div className="text-sm text-gray-600">{item.location}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* PC版：2段レイアウト */}
            <div className="hidden lg:block max-w-5xl mx-auto space-y-2">
              {/* 1段目：月〜木 */}
              <div className="grid grid-cols-4 gap-2">
                {schedule.slice(0, 4).map((item) => (
                  <div 
                    key={item.id}
                    className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center"
                  >
                    <div className="text-lg font-bold mb-2 text-blue-900">
                      {item.day}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {item.time}
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.location}
                    </div>
                  </div>
                ))}
              </div>

              {/* 2段目：金〜日 + 空白 */}
              <div className="grid grid-cols-4 gap-2">
                {schedule.slice(4).map((item) => (
                  <div 
                    key={item.id}
                    className={`p-4 rounded-lg border text-center ${
                      item.isHoliday 
                        ? 'bg-gray-50 border-gray-300' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className={`text-lg font-bold mb-2 ${
                      item.isHoliday ? 'text-gray-700' : 'text-blue-900'
                    }`}>
                      {item.day}
                    </div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">
                      {item.time}
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.location}
                    </div>
                  </div>
                ))}
                {/* 空白スペース */}
                <div></div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-80 mt-4 lg:mt-0">
            <Image
              src="/img/image2.jpg"
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
