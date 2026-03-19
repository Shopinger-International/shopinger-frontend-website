import { useEffect, useState } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

// external components
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";

// helpers
import clsx from "clsx";

// swiper modules
import { Navigation } from "swiper/modules";

// styles
import "swiper/css";
import "swiper/css/navigation";

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
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    if (open && swiper) {
      swiper.slideTo(active_index);
    }
  }, [active_index, open, swiper]);

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/60" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative w-full max-w-5xl space-y-3 rounded-2xl border border-gray-300 bg-white p-6 shadow-xl">
          <h6 className="font-medium">{product_title}</h6>
          <div className="flex h-full w-full flex-row gap-6">
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
                {/* RIGHT: Swiper Gallery */}
                <Swiper
                  modules={[Navigation]}
                  navigation
                  spaceBetween={10}
                  slidesPerView={1}
                  onSwiper={setSwiper}
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
                </Swiper>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProductGalleryDialog;
