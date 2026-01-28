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
    <div className="lg:max-w-8xl relative mx-auto w-full overflow-hidden rounded-xl border-2 border-gray-300">
      {/* Left Arrow */}
      <button className="promo-prev absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur transition hover:bg-black/60">
        <ChevronLeft className="size-4 text-white lg:size-8" />
      </button>

      {/* Right Arrow */}
      <button className="promo-next absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 backdrop-blur transition hover:bg-black/60">
        <ChevronRight className="size-4 text-white lg:size-8" />
      </button>

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        speed={900}
        parallax
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: ".promo-prev",
          nextEl: ".promo-next",
        }}
        pagination={{
          clickable: true,
        }}
        loop
      >
        {banners.map(({ key, image_src }) => (
          <SwiperSlide key={key}>
            <div className="group relative aspect-2/1 w-full overflow-hidden lg:aspect-20/3">
              <Image
                src={image_src}
                alt={key}
                fill
                priority
                data-swiper-parallax="-10%"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PromoBanner;
