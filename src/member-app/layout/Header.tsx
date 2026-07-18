'use client';

import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/member-app/auth/AuthContext';
import RoleManager from '@/member-app/admin/RoleManager';

export default function Header() {
  const { role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [roleManagerOpen, setRoleManagerOpen] = useState(false);

  return (
    <>
      <header className="bg-blue-900 text-white px-4 py-3 flex items-center justify-between">
        <h1 className="text-base font-bold">野田学園陸上競技部</h1>
        <button
          onClick={() => setMenuOpen(true)}
          className="p-1"
          aria-label="メニュー"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-0 right-0 z-50 h-full w-60 bg-white shadow-xl flex flex-col">
            <div className="flex justify-end p-4 border-b">
              <button onClick={() => setMenuOpen(false)} className="text-gray-400 p-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col flex-1 p-4 gap-1">
              {role === 'teacher' && (
                <button
                  onClick={() => { setMenuOpen(false); setRoleManagerOpen(true); }}
                  className="text-left text-sm font-medium px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                >
                  ロール管理
                </button>
              )}
            </nav>
            <div className="p-4 border-t">
              <button
                onClick={() => signOut(auth)}
                className="w-full text-left text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 text-red-500"
              >
                ログアウト
              </button>
            </div>
          </div>
        </>
      )}

      {roleManagerOpen && (
        <RoleManager onClose={() => setRoleManagerOpen(false)} />
      )}
    </>
  );
}
