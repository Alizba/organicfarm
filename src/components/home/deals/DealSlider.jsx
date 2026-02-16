"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import DealCard from './DealCard'
import { index } from "@/lib/data/index";

export default function DealSlider() {
  return (
    <div className="py-10 px-4 md:px-16 relative">

      <button 
        className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="text-green-700" size={24} />
      </button>
      
      <button 
        className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="text-green-700" size={24} />
      </button>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: '.swiper-button-prev-custom',
          nextEl: '.swiper-button-next-custom',
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="px-12"
      >
        {index.map((category) => (
          <SwiperSlide key={category.id}>
            <DealCard {...category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}