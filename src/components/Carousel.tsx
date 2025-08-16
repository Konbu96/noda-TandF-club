// Carousel.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import { topPhotos } from "../../date/photo"; // ← ここで読み込み

export default function Carousel() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
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
            {/* <p className="text-center mt-2 text-sm text-gray-600">
              {photo.alt}
            </p> */}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
