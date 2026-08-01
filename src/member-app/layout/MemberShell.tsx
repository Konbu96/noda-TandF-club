'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/member-app/auth/AuthContext';
import Header from './Header';
import BottomNav from './BottomNav';

export default function MemberShell({ children }: { children: React.ReactNode }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/noda-member-login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Header />
      <main>
        {role === null ? (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
            <p className="text-gray-500 text-sm leading-relaxed">
              役割がまだ設定されていません。<br />管理者にお問い合わせください。
            </p>
          </div>
        ) : (
          children
        )}
      </main>
      {role !== null && <BottomNav />}
    </div>
  );
}
