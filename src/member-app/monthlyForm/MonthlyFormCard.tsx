'use client';

import { currentMonthLabel } from './monthlyFormService';

export default function MonthlyFormCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <p className="text-sm font-bold text-blue-900">{currentMonthLabel()}フォーム</p>
      <a
        href="/member/monthly-form"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center text-sm bg-blue-900 text-white py-2 rounded-xl"
      >
        {currentMonthLabel()}フォームを開く →
      </a>
    </div>
  );
}
