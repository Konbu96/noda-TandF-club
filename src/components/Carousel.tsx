// Carousel.tsx
"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import { topPhotos } from "../../date/photo"; // ← ここで読み込み

export default function Carousel() {
  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="w-full max-w-3xl mx-auto relative">
      {/* カスタムナビゲーション（外側配置） */}
      <button
        ref={prevRef}
        aria-label="前へ"
        className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -left-12 z-10 w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-900/70 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M15.78 4.22a.75.75 0 010 1.06L9.06 12l6.72 6.72a.75.75 0 11-1.06 1.06l-7.25-7.25a.75.75 0 010-1.06l7.25-7.25a.75.75 0 011.06 0z" clipRule="evenodd" />
        </svg>
      </button>
      <button
        ref={nextRef}
        aria-label="次へ"
        className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 -right-12 z-10 w-10 h-10 rounded-full bg-blue-900 text-white hover:bg-blue-900/70 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path fillRule="evenodd" d="M8.22 19.78a.75.75 0 010-1.06L14.94 12 8.22 5.28a.75.75 0 111.06-1.06l7.25 7.25a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0z" clipRule="evenodd" />
        </svg>
      </button>

      <Swiper
        modules={[Navigation, Autoplay]}
        onBeforeInit={(swiper) => {
          swiper.params.navigation = {
            ...(swiper.params.navigation as any),
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          };
        }}
        navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
        autoplay={{ delay: 5000 }}
        loop
        spaceBetween={20}
        slidesPerView={1}
        className="rounded-lg shadow-lg"
      >
        {topPhotos.map((photo, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[400px]">
              <Image
                src={photo.path}
                alt={photo.alt}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
