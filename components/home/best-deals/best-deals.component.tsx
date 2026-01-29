import { FC, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";

// css
import "swiper/css";
import "swiper/css/navigation";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// local components
import BestDealsCard from "@/components/home/best-deals/best-deals-card.component";

const BestDeals: FC = () => {
  const swiperRef = useRef<any>(null);

  const handlePrev = () => {
    swiperRef.current?.slidePrev();
  };

  const handleNext = () => {
    swiperRef.current?.slideNext();
  };

  return (
    <section className="bg-[#FFE2D0]">
      <div className="max-w-8xl mx-auto p-4">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            Best Deals for you
          </h2>
        </div>

        {/* Swiper Container */}
        <div className="relative mb-2">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-50 md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Swiper */}
          <Swiper
            modules={[Navigation]}
            spaceBetween={16}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            slidesPerView="auto"
          >
            {Array.from({ length: 9 }).map((_, i) => (
              <SwiperSlide key={i} className="w-auto!">
                <BestDealsCard />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-white p-3 text-gray-900 shadow-lg transition-all hover:scale-110 hover:bg-gray-50 md:flex"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <Link
          href="/fashion"
          className="inline-block font-semibold text-orange-500 hover:underline"
        >
          See All Offers
        </Link>
      </div>
    </section>
  );
};

export default BestDeals;
