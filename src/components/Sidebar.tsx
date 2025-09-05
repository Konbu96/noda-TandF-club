'use client';

import { useState } from 'react';
import Link from 'next/link';

const menus = [
  {
    label: '概要',
    href: '/#intro',
    isExternal: false,
  },
  {
    label: 'ニュース',
    href: '/#news',
    isExternal: false,
  },
  {
    label: 'スケジュール',
    href: '/#schedule',
    isExternal: false,
  },
  {
    label: 'instagram',
    href: 'https://www.instagram.com/noda_track.field?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
    isExternal: true,
  },
  {
    label: 'NEKONIWA',
    href: 'https://neko-niwa.com/',
    isExternal: true,
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* スマホ用ヘッダー */}
      <header className={`md:hidden fixed top-0 left-0 right-0 bg-blue-900 text-white p-4 z-30 shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="w-10"></div> {/* 左側のスペーサー */}
          <h1 className="leading-tight text-[14px] sm:text-[28px] font-bold text-center flex-1">
            野田学園陸上競技部
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 text-white hover:bg-blue-800 rounded-lg transition-colors w-10"
            aria-label="メニューを開く"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* オーバーレイ */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
          onClick={closeSidebar}
        />
      )}

      {/* サイドバー */}
      <aside
        className={`fixed top-0 left-0 h-full w-70 bg-blue-900 p-4 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:z-auto md:top-0`}
      >
        {/* 閉じるボタン（モバイルのみ） */}
        <button
          onClick={closeSidebar}
          className="absolute top-4 right-4 text-white md:hidden"
          aria-label="メニューを閉じる"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h1 className="leading-tight text-[14px] sm:text-[28px] font-bold m-2 text-white text-center">
          野田学園<br/>陸上競技部
        </h1>
        
        <div className="mt-8">
          <ul className="text-[20px] leading-15 text-center">
            {menus.map((menu, index) => (
              <li key={index} className="mb-4">
                <Link 
                  href={menu.href}
                  target={menu.isExternal ? '_blank' : '_self'}
                  rel={menu.isExternal ? 'noopener noreferrer' : undefined}
                  className="text-white hover:text-gray-300 transition-colors"
                  onClick={closeSidebar}
                >
                  {menu.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
