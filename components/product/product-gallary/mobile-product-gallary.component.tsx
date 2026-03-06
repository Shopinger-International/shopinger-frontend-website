import Image from "next/image";

// types
import type { FC } from "react";
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

// hoc
import withProductGalleryFunctionality from "@/hoc/product/with-product-gallery-functionality.hoc";

// external component
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type IProps = {
  variant_medias_with_title: IVariantMediaWithTitle[];
};

const MobileProductGallary: FC<IProps> = ({ variant_medias_with_title }) => {
  return (
    <>
      <div className="relative order-2 mb-4 space-y-4 lg:hidden">
        <Swiper
          modules={[Pagination]}
          slidesPerView={1.2}
          spaceBetween={16}
          pagination={{
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          className="relative w-full"
        >
          {variant_medias_with_title.map(({ media, image_title }, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-neutral-300">
                <Image
                  sizes="(min-width: 1024px) 10vw, 100vw"
                  loading={"eager"}
                  fill
                  src={media.url}
                  alt={image_title}
                  priority={index === 0}
                  quality={75}
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default withProductGalleryFunctionality(MobileProductGallary);
