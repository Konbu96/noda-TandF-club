'use client';

import Link from 'next/link';
import { useMonthlyForm } from './useMonthlyForm';

export default function MonthlyFormBanner() {
  const { entry, loading } = useMonthlyForm();

  if (loading || entry) return null;

  return (
    <div className="bg-blue-900 px-4 py-5 text-center space-y-1">
      <p className="text-base font-bold text-white">
        月末フォームにまだ回答していません
      </p>
      <Link href="/member" className="inline-block text-sm font-bold text-white underline underline-offset-2">
        今すぐ回答する →
      </Link>
    </div>
  );
}
