'use client';

import { currentMonthLabel } from './monthlyFormService';
import { useMonthlyForm } from './useMonthlyForm';
import { useMonthlyFormOverlay } from './MonthlyFormOverlayContext';

export default function MonthlyFormCard() {
  const { entry, loading } = useMonthlyForm();
  const { show } = useMonthlyFormOverlay();
  const answered = !loading && !!entry;

  return (
    <div className="bg-white rounded-2xl card-shadow p-5 space-y-3">
      <p className="text-sm font-bold text-blue-900">{currentMonthLabel()}フォーム</p>
      <button
        onClick={show}
        className={`w-full text-sm py-2 rounded-xl ${
          answered ? 'bg-gray-100 text-gray-500' : 'bg-blue-900 text-white'
        }`}
      >
        {answered ? 'フォーム回答済み' : `${currentMonthLabel()}フォームを開く →`}
      </button>
    </div>
  );
}
