'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/member/menu');
    } catch (e) {
      if (e instanceof FirebaseError && e.code === 'auth/email-already-in-use') {
        setError('このメールアドレスはすでに登録されています。ログインしてください');
      } else {
        setError(
          isLogin
            ? 'メールアドレスまたはパスワードが間違っています'
            : 'アカウントの作成に失敗しました'
        );
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-blue-800 transition"
        >
          {isLogin ? 'ログイン' : 'アカウントを作成する'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        {isLogin ? 'アカウントをお持ちでない方は' : 'アカウントをお持ちの方は'}
        <button
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          className="ml-1 text-blue-900 underline"
        >
          {isLogin ? 'アカウント作成' : 'ログイン'}
        </button>
      </p>
    </div>
  );
}
