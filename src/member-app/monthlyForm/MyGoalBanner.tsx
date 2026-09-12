'use client';

import { useAuth } from '@/member-app/auth/AuthContext';
import { useMonthlyForm } from './useMonthlyForm';

export default function MyGoalBanner() {
  const { role } = useAuth();
  const { entry, loading } = useMonthlyForm();

  if (role === 'teacher' || role === 'manager') return null;
  if (loading) return null;

  if (!entry) {
    return <p className="text-sm font-bold text-blue-900">⚠️未回答</p>;
  }

  return (
    <p className="text-sm font-bold text-blue-900">
      目標：{entry.nextGoal || '未設定'}
    </p>
  );
}
