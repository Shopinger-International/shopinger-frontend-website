import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";
import type Swiper from "swiper";

// external components
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  DialogTitle,
} from "@headlessui/react";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";

// helpers
import clsx from "clsx";

// swiper modules
import { Navigation } from "swiper/modules";

// styles
import "swiper/css";
import "swiper/css/navigation";

// icons
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type IProps = {
  product_title: string;
  variant_medias_with_title: IVariantMediaWithTitle[];
  open: boolean;
  handleClose: () => void;
  selected_index: number;
};

const ProductGalleryDialog: FC<IProps> = ({
  product_title,
  variant_medias_with_title,
  open,
  handleClose,
  selected_index,
}) => {
  const [active_index, setActiveIndex] = useState(selected_index);
  const swiper_ref = useRef<Swiper>(null);

  useEffect(() => {
    if (open && swiper_ref.current) {
      swiper_ref.current.slideTo(active_index);
    }
  }, [active_index, open]);

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-5xl space-y-3 rounded-2xl border border-gray-300 bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-medium">{product_title}</DialogTitle>

            <button
              onClick={handleClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X className="size-6" />
            </button>
          </div>
          <div className="flex h-[80vh] w-full flex-row gap-6">
            <div className="flex h-full flex-col gap-3 overflow-y-auto">
              {variant_medias_with_title.map((item, index) => {
                const is_active = index === active_index;

                return (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={clsx(
                      "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg transition-all duration-300",
                      is_active
                        ? "border-2 border-orange-500"
                        : "border border-gray-300",
                    )}
                  >
                    <Image
                      src={item.media.url}
                      alt={item.image_title}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* RIGHT: Featured */}
            <div className="order-1 flex min-w-0 flex-1 items-center justify-center md:order-2">
              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gray-300">
                <button
                  onClick={() => swiper_ref.current?.slidePrev()}
                  disabled={active_index <= 0}
                  className="absolute top-1/2 left-6 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-orange-500 p-2 text-white shadow-sm transition-all hover:scale-110 hover:bg-orange-600 disabled:bg-orange-300 md:flex"
                >
                  <ChevronLeft className="size-8" />
                </button>
                <SwiperComponent
                  modules={[Navigation]}
                  spaceBetween={10}
                  slidesPerView={1}
                  onSwiper={(swiper) => {
                    swiper_ref.current = swiper;
                  }}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  initialSlide={selected_index}
                  className="h-full w-full"
                >
                  {variant_medias_with_title.map((item, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative h-full w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                        <Image
                          src={item.media.url}
                          alt={item.image_title}
                          fill
                          className="object-contain transition-all duration-500"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </SwiperComponent>

                {/* Right arrow */}
                <button
                  onClick={() => swiper_ref.current?.slideNext()}
                  disabled={
                    active_index >= variant_medias_with_title.length - 1
                  }
                  className="absolute top-1/2 right-6 z-10 flex -translate-y-10 items-center justify-center rounded-full bg-orange-500 p-2 text-white shadow-sm transition-all hover:scale-110 hover:bg-orange-600 disabled:bg-orange-300"
                >
                  <ChevronRight className="size-8" />
                </button>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProductGalleryDialog;
