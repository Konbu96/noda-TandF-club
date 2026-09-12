'use client';

import { useAuth } from '@/member-app/auth/AuthContext';
import { currentMonthLabel } from './monthlyFormService';
import { useMonthlyForm } from './useMonthlyForm';
import { useMonthlyFormOverlay } from './MonthlyFormOverlayContext';

export default function MonthlyFormBanner() {
  const { role } = useAuth();
  const { entry, loading } = useMonthlyForm();
  const { show } = useMonthlyFormOverlay();

  if (role === 'teacher' || role === 'manager') return null;
  if (loading || entry) return null;

  return (
    <div className="bg-blue-900 px-4 py-5 text-center space-y-1">
      <p className="text-base font-bold text-white">{currentMonthLabel()}フォームにまだ回答していません</p>
      <button onClick={show} className="text-sm font-bold text-white underline underline-offset-2">
        今すぐ回答する →
      </button>
    </div>
  );
}
