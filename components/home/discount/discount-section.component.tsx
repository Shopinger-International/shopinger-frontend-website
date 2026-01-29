import { useRef } from "react";
import Link from "next/link";
import type { FC } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import DiscountCard from "@/components/home/discount/discount-card.component";

import "swiper/css";
import "swiper/css/navigation";

const DiscountSection: FC = () => {
  const swiperRef = useRef<any>(null);

  return (
    <section>
      <div className="max-w-8xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-3xl">
            Discount UP <span className="text-orange-500">To 50% Off</span>
          </h2>
          <Link
            href="/testing"
            className="text-sm font-semibold text-orange-500 hover:underline md:text-base"
          >
            View All
          </Link>
        </div>

        {/* Swiper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 md:flex"
          >
            <ChevronLeft />
          </button>

          <Swiper
            modules={[Navigation]}
            slidesPerView="auto"
            spaceBetween={16}
            grabCursor
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <SwiperSlide key={i} className="w-auto!">
                <DiscountCard />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right arrow */}
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 md:flex"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default DiscountSection;
