import Image from "next/image";
import { topPhotos } from "./photo";

export default function Home() {
  return (
    <div className="bg-white text-center flex h-screen">
      {/* サイドメニュー */}
        <aside className="w-70 bg-blue-900 p-4">
          <h1 className="leading-tight text-[10px] sm:text-[35px] text-white font-bold m-2">
        野田学園<br/>陸上競技部
          </h1>
          <div>
            <ul className="text-[20px] leading-15">
              <li><a href="">概要</a></li>
              <li><a href="">ニュース</a></li>
              <li><a href="">スケジュール</a></li>
              <li><a href="https://www.instagram.com/noda_track.field?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank">instagram</a></li>
              <li><a href="https://neko-niwa.com/" target="_blank">NEKONIWA</a></li>
            </ul>
          </div>
        </aside>

      {/* メイン */}
      <main className="flex-1 p-6 bg-white">
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
      </main>
      
    </div>
  );
}  