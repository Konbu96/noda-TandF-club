'use client';

import Image from 'next/image';

export default function Schedule() {
  const scheduleLocations = [
    {
      id: 1,
      location: '学校',
      days: '月, 火, 木, 金',
      description: '基本的に走り系の練習',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900'
    },
    {
      id: 2,
      location: '競技場',
      days: '水, 土',
      description: '専門競技の練習',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900'
    },
    {
      id: 3,
      location: '休み',
      days: '日, 習い事等用事のある日',
      description: '',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-300',
      textColor: 'text-gray-700'
    }
  ];

  return (
    <div id="schedule" className="py-4 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-3 text-center">スケジュール</h2>
        <p className="text-center text-gray-700 mb-4 text-sm lg:text-base">週ごとの活動スケジュールです</p>
        <div className="flex flex-col lg:flex-row lg:flex-row-reverse lg:items-stretch lg:gap-8">
          <div className="flex-1 flex items-center">
            <div className="text-left border border-gray-300 lg:h-full lg:flex lg:flex-col w-full">
              {scheduleLocations.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`text-lg flex p-6 lg:flex-1 lg:items-center ${index < scheduleLocations.length - 1 ? 'border-b border-gray-300' : ''} ${item.bgColor}`}
                >
                  <span className="font-bold text-blue-900 w-20">{item.location}</span>
                  <span className="text-blue-900">：</span>
                  <span className="text-gray-700 flex-1">
                    {item.days}
                    {item.description && (
                      <span className="text-gray-600">　（{item.description}）</span>
                    )}
                  </span>
                </div>
              ))}
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
