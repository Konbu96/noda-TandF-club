'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import PieChart from './PieChart';

export default function Members() {
  const pieChartsRef = useRef<HTMLDivElement>(null);
  const [imageHeight, setImageHeight] = useState<number>(256);

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
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          <div className="flex-1">
            <div className="mx-auto max-w-3xl">
              {/* 円グラフ */}
              <div ref={pieChartsRef} className="grid grid-cols-2 gap-2 lg:gap-6">
                <PieChart
                  title="中高生比"
                  total={19}
                  segments={[
                    { label: '高校生', value: 13, color: '#1e40af', percentage: 0.684 },
                    { label: '中学生', value: 6, color: '#3b82f6', percentage: 0.316 }
                  ]}
                />
                <PieChart
                  title="男女比"
                  total={19}
                  segments={[
                    { label: '男性', value: 11, color: '#60a5fa', percentage: 0.579 },
                    { label: '女性', value: 8, color: '#f472b6', percentage: 0.421 }
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
              src="/img/image4.jpg"
              alt="陸上競技部のメンバー"
              fill
              className="shadow-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
