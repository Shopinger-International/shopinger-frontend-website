import { useState } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type IVariant from "@/types/variant";
import type IProduct from "@/types/product";
import type { IMediaGroup } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";
// icons
import { Heart } from "lucide-react";

// external component
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// local component
import Badge from "@/components/product/badge.component";

// helpers
import clsx from "clsx";
import { generateSlug, getStockStatus } from "@/helpers/product.helper";
import { capitalizeValue } from "@/helpers/common.helper";

type IProps = {
  product: IProduct;
  variant: IVariant;
  media_group: IMediaGroup;
};

const MobileProductGallary: FC<IProps> = ({
  product: { title, brand, product_medias },
  variant: { variant_attribute_values, variant_inventory },
  media_group,
}) => {
  let variant_medias = variant_attribute_values
    .filter(({ attribute }) => attribute.is_visual)
    .flatMap(({ attribute, value }) => {
      const medias = media_group[attribute.id as number][value.toLowerCase()];
      return medias;
    });
  variant_medias = !!variant_medias.length
    ? variant_medias
    : product_medias.map(({ media }) => media);
  const stock_status = getStockStatus(variant_inventory);
  return (
    <>
      <div className="relative space-y-4 lg:hidden">
        <Swiper
          key={variant_medias.length}
          modules={[Pagination]}
          slidesPerView={1.2}
          spaceBetween={16}
          pagination={{
            bulletClass: "custom-bullet",
            bulletActiveClass: "custom-bullet-active",
          }}
          className="relative w-full"
        >
          {variant_medias.map((media, index) => (
            <SwiperSlide key={index}>
              <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-neutral-300">
                <Image
                  src={media.url}
                  alt={`product-image-${index}`}
                  fill
                  priority={index === 0}
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

export default MobileProductGallary;
