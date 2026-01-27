import Image from "next/image";
import type { FC } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ChevronLeft, ChevronRight } from "lucide-react";

const banners = [
  {
    key: "banner-1",
    image_src: "/promo-banner/banner-1.png",
    width: 1920,
    height: 600,
  },
  {
    key: "banner-2",
    image_src: "/promo-banner/banner-2.png",
    width: 1920,
    height: 600,
  },
  {
    key: "banner-3",
    image_src: "/promo-banner/banner-3.png",
    width: 1920,
    height: 600,
  },
];

const PromoBanner: FC = () => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Left Arrow */}
      <button className="promo-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur transition hover:bg-black/60">
        <ChevronLeft className="size-8 text-white" />
      </button>

      {/* Right Arrow */}
      <button className="promo-next absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur transition hover:bg-black/60">
        <ChevronRight className="size-8 text-white" />
      </button>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        navigation={{
          prevEl: ".promo-prev",
          nextEl: ".promo-next",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
      >
        {banners.map(({ key, image_src, width, height }) => (
          <SwiperSlide key={key}>
            <div className="relative aspect-16/5 w-full">
              <Image
                src={image_src}
                alt={key}
                fill
                className="object-cover object-top"
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PromoBanner;
