import Image from "next/image";
import { topPhotos } from "./photo";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

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
]

export default function Home() {
  return (
    <div className="bg-white text-center flex h-screen text-white">
      {/* サイドメニュー */}
        <aside className="w-70 bg-blue-900 p-4">
          <h1 className="leading-tight text-[10px] sm:text-[35px] font-bold m-2">
        野田学園<br/>陸上競技部
          </h1>
          <div>
            <ul className="text-[20px] leading-15">
              {menus.map((menu, index) => (
                <li key={index} className="mb-4">
                  <Link 
                    href={menu.href}
                    target={menu.isExternal ? '_blank' : '_self'}
                    rel={menu.isExternal ? 'noopener noreferrer' : undefined}
                    className="text-white hover:text-gray-500"
                  >
                    {menu.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

      {/* メイン */}
      <main className="flex-1 p-6 bg-white text-blue-700">
        <div className="grid grid-cols-2 sm:grid-cols-3 max-w-5xl max-auto gap-4 m-auto">
          {topPhotos.map((photo,index) => (
          <div key={index} className="relative w-full aspect-video overflow-hidden rounded-lg">
             <Image
            src={photo.path}
            alt={photo.alt}
            fill={true}
            className="object-cover"
           />
          </div>
          ))}
        </div>

        <div>
          <h2>ニュース</h2>
          <ul>
            <li>2025</li>
            <li>2025</li>
            <li>2025</li>
          </ul>
        </div>

        <div>
          <h2>スケジュール</h2>
          <li>月曜日</li>
          <li>火曜日</li>
          <li>水曜日</li>
          <li>木曜日</li>
          <li>金曜日</li>
          <li>土曜日</li>
          <li>日曜日</li>
        </div>

      </main>
      
    </div>
  );
}  