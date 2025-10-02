'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const menus = [
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
    label: 'みんなの声',
    href: '#voices',
    isExternal: false,
  },
  {
    label: 'よくある質問',
    href: '#faq',
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
    case 'ニュース':
      return (
        <Image
          src="/icons/news.svg"
          alt="ニュース"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      );
    case 'スケジュール':
      return (
        <Image
          src="/icons/schedule.svg"
          alt="スケジュール"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      );
    case 'メンバー':
      return (
        <Image
          src="/icons/member.svg"
          alt="メンバー"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      );
    case 'みんなの声':
      return (
        <Image
          src="/icons/voice.svg"
          alt="みんなの声"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      );
    case 'よくある質問':
      return (
        <Image
          src="/icons/question.svg"
          alt="よくある質問"
          width={20}
          height={20}
          className="w-5 h-5"
        />
      );
    case '体験入部申し込み':
      return (
        <Image
          src="/icons/application.svg"
          alt="体験入部申し込み"
          width={20}
          height={20}
          className="w-5 h-5"
        />
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
      {/* 全画面用ヘッダー */}
      <header className={`fixed top-0 left-0 right-0 bg-blue-900 text-white p-2 z-30 shadow-lg transition-all duration-300`}>
        <div className="flex items-center justify-between">
          <div className="w-10"></div> {/* 左側のスペーサー */}
          <h1 className="leading-tight text-[20px] sm:text-[24px] font-bold text-center flex-1">
            野田学園陸上競技部
          </h1>
          <button
            onClick={toggleSidebar}
            className="p-2 text-white hover:bg-blue-800 rounded-lg transition-colors w-10"
            aria-label="メニューを開く"
          >
            <svg
              className="w-7 h-7"
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
        }`}
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
