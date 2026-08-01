'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/member-app/auth/AuthContext';
import SignInForm from '@/member-app/auth/SignInForm';

export default function SignInPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/member');
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-900">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900 px-6">
      <h1 className="text-white text-2xl font-bold mb-2">野田学園陸上競技部</h1>
      <p className="text-blue-200 text-sm mb-8">部員ログイン</p>
      <SignInForm />
    </div>
  );
}
