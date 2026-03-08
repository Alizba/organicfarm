"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import DealCard from "./DealCard";

export default function DealSlider() {
  const [deals, setDeals]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customer/deals")
      .then((r) => r.json())
      .then((d) => setDeals(d.deals || []))
      .catch((e) => console.error("Failed to load deals", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-10 px-4 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-3xl border border-green-200 bg-white/30 animate-pulse h-72" />
          ))}
        </div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="py-10 px-4 text-center">
        <p className="text-white/80 text-sm">No deals available right now. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="py-10 px-4 md:px-16 relative">

      <button
        className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft className="text-green-700" size={24} />
      </button>

      <button
        className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-green-50 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight className="text-green-700" size={24} />
      </button>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          640:  { slidesPerView: 2, spaceBetween: 20 },
          768:  { slidesPerView: 3, spaceBetween: 20 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
        className="px-12"
      >
        {deals.map((product) => (
          <SwiperSlide key={product._id}>
            <DealCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}