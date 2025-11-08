'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import PieChart from './PieChart';

export default function Members() {
  const pieChartsRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState<number>(256);

  // 開発者が入力する基本的な人数
  const highSchoolStudents = 14; // 高校生の人数
  const middleSchoolStudents = 6; // 中学生の人数
  const maleStudents = 12; // 男子の人数
  const femaleStudents = 8; // 女子の人数

  // 計算で算出される値
  const total = maleStudents + femaleStudents;
  const highSchoolPercentage = highSchoolStudents / total;
  const middleSchoolPercentage = middleSchoolStudents / total;
  const malePercentage = maleStudents / total;
  const femalePercentage = femaleStudents / total;

  useEffect(() => {
    const updateHeight = () => {
      if (pieChartsRef.current) {
        setImageHeight(pieChartsRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div id="members" className="py-4 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-xl font-bold mb-3 text-center">メンバー構成</h2>
        <p className="text-center text-gray-700 mb-4 text-sm lg:text-base">中学生から高校生まで、男女問わず仲良く一緒に活動しています</p>
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <div className="mx-auto max-w-3xl">
              {/* 円グラフ */}
              <div ref={pieChartsRef} className="grid grid-cols-2 gap-2 lg:gap-6">
                <PieChart
                  title="中高生比"
                  total={total}
                  segments={[
                    { label: '高校生', value: highSchoolStudents, color: '#1e40af', percentage: highSchoolPercentage },
                    { label: '中学生', value: middleSchoolStudents, color: '#3b82f6', percentage: middleSchoolPercentage }
                  ]}
                />
                <PieChart
                  title="男女比"
                  total={total}
                  segments={[
                    { label: '男性', value: maleStudents, color: '#60a5fa', percentage: malePercentage },
                    { label: '女性', value: femaleStudents, color: '#f472b6', percentage: femalePercentage }
                  ]}
                />
              </div>
            </div>
          </div>
          <div 
            className="relative flex-shrink-0 w-full lg:w-80 mt-4 lg:mt-0"
            style={{ height: `${imageHeight}px` }}
          >
            <Image
              src="/img/image3.jpg"
              alt="陸上競技部のメンバー"
              fill
              className="shadow-lg object-cover object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
