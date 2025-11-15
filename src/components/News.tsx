import Image from 'next/image';

export default function News() {
  return (
    <div id="news" className="py-2 lg:py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-lg font-bold mb-2 text-center lg:text-xl lg:mb-3">ニュース</h2>
        <p className="text-center text-gray-700 mb-4 text-sm lg:text-base">部活動の最新ニュースです</p>
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:gap-8">
          <div className="flex-1">
            <div className="max-w-6xl mx-auto">
              <dl className="text-left space-y-1 lg:space-y-0">
                <div className="bg-blue-100 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                  <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年11月16日</dt>
                  <dd className="text-xs lg:text-sm">第75回 山口県陸上競技強化記録会</dd>
                </div>
                <div className="bg-blue-50 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                  <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年10月25日〜10月26日</dt>
                  <dd className="text-xs lg:text-sm">高校秋季県大会</dd>
                </div>
                <div className="bg-blue-100 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                  <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年10月17日〜10月19日</dt>
                  <dd className="text-xs lg:text-sm">第56回 U16陸上競技大会</dd>
                </div>
                <div className="bg-blue-50 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                  <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年10月11日〜10月12日</dt>
                  <dd className="text-xs lg:text-sm">令和７年度　中国高等学校新人陸上競技対校選手権大会</dd>
                </div>
                <div className="bg-blue-100 p-1 lg:p-2 flex flex-col lg:flex-row lg:gap-4">
                  <dt className="text-xs lg:text-sm font-semibold lg:w-48 lg:flex-shrink-0">2025年9月20日〜9月21日</dt>
                  <dd className="text-xs lg:text-sm">山口県高等学校新人競技選手権大会で3名が中国高校新人大会への出場権を獲得しました。</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="flex-shrink-0 w-full lg:w-80 mt-4 lg:mt-0">
            <Image
              src="/img/image1.jpg"
              alt="陸上競技部の練習"
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

