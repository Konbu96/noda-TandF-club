'use client';

import { currentMonthLabel } from './monthlyFormService';
import { useMonthlyForm } from './useMonthlyForm';

export default function MonthlyFormBanner() {
  const { entry, loading } = useMonthlyForm();

  if (loading || entry) return null;

  return (
    <div className="bg-blue-900 px-4 py-5 text-center space-y-1">
      <p className="text-base font-bold text-white">{currentMonthLabel()}フォームにまだ回答していません</p>
      <a
        href="/member/monthly-form"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block text-sm font-bold text-white underline underline-offset-2"
      >
        今すぐ回答する →
      </a>
    </div>
  );
}
