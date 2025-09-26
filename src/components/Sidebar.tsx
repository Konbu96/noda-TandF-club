'use client';

import { useState } from 'react';
import Link from 'next/link';

const menus = [
  {
    label: '概要',
    href: '#intro',
    isExternal: false,
  },
  {
    label: 'ニュース',
    href: '#news',
    isExternal: false,
  },
  {
    label: 'スケジュール',
    href: '#schedule',
    isExternal: false,
  },
  {
    label: 'メンバー',
    href: '#members',
    isExternal: false,
  },
  {
    label: '体験入部申し込み',
    href: '#experience-form',
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

function MenuIcon({ label }: { label: string }) {
  const common = 'w-5 h-5 text-white';
  // 仮アイコン（Heroicons風のインラインSVG）
  switch (label) {
    case '概要':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 12l9-9 9 9"/>
          <path d="M9 21V9h6v12"/>
        </svg>
      );
    case 'ニュース':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 6h16M4 10h16M4 14h10M4 18h8"/>
        </svg>
      );
    case 'スケジュール':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      );
    case 'メンバー':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M22 21v-2a4 4 0 00-3-3.87"/>
          <path d="M16 3.13a4 4 0 010 7.75"/>
        </svg>
      );
    case '体験入部申し込み':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/>
          <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z"/>
        </svg>
      );
    case 'instagram':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="5"/>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
          <circle cx="17.5" cy="6.5" r="1"/>
        </svg>
      );
    case 'NEKONIWA':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 17L17 7"/>
          <path d="M7 7h10v10"/>
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
        </svg>
      );
  }
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleInternalLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    
    // モバイルの場合はサイドバーを閉じる
    closeSidebar();
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, menu: any) => {
    if (menu.isExternal) {
      closeSidebar();
    } else {
      handleInternalLink(e, menu.href);
    }
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
                  onClick={(e) => handleLinkClick(e, menu)}
                >
                  <span className="flex items-center gap-2 justify-center">
                    <MenuIcon label={menu.label} />
                    <span>{menu.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
