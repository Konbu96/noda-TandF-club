'use client';

import Link from 'next/link';

function isNearMonthEnd(): boolean {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }));
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return lastDay - now.getDate() < 5; // 月末5日前から表示
}

export default function MonthlyFormBanner() {
  if (!isNearMonthEnd()) return null;

  return (
    <div className="bg-blue-900 px-4 py-5 text-center space-y-1">
      <p className="text-base font-bold text-white">月末フォームにそろそろ回答しましょう</p>
      <Link href="/member" className="inline-block text-sm font-bold text-white underline underline-offset-2">
        今すぐ回答する →
      </Link>
    </div>
  );
}
