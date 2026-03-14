import { Fragment } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

// external components
import { Dialog } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";

// swiper modules
import { Navigation, Pagination } from "swiper/modules";

// icons
import { X } from "lucide-react";

// styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type IProps = {
  variant_medias_with_title: IVariantMediaWithTitle[];
  open: boolean;
  handleClose: () => void;
  selected_index: number;
};

const ProductGalleryDialog: FC<IProps> = ({
  variant_medias_with_title,
  open,
  handleClose,
  selected_index,
}) => {
  return (
    <Dialog open={open} onClose={handleClose} as={Fragment}>
      <div className="fixed inset-0 z-50 bg-black/90">
        <div className="flex h-full w-full items-center justify-center p-6">
          {/* Close */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 z-50 rounded-md bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>

          {/* Swiper */}
          <div className="h-full w-full max-w-6xl">
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              initialSlide={selected_index}
              className="h-full"
            >
              {variant_medias_with_title.map(
                ({ media, image_title }, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative h-full w-full">
                      <Image
                        src={media.url}
                        alt={image_title}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </SwiperSlide>
                ),
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProductGalleryDialog;
