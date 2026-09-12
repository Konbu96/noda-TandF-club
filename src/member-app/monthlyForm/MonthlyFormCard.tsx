'use client';

import { currentMonthLabel } from './monthlyFormService';
import { useMonthlyFormOverlay } from './MonthlyFormOverlayContext';

export default function MonthlyFormCard() {
  const { show } = useMonthlyFormOverlay();

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <p className="text-sm font-bold text-blue-900">{currentMonthLabel()}フォーム</p>
      <button onClick={show} className="w-full text-sm bg-blue-900 text-white py-2 rounded-xl">
        {currentMonthLabel()}フォームを開く →
      </button>
    </div>
  );
}
