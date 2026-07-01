import Image from "next/image";
import { FC, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType } from "embla-carousel";

// types
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

// hoc
import withProductGalleryFunctionality from "@/hoc/product/with-product-gallery-functionality.hoc";

type IProps = {
  variant_medias_with_title: IVariantMediaWithTitle[];
};

const MobileProductGallary: FC<IProps> = ({ variant_medias_with_title }) => {
  const [embla_ref, embla_api] = useEmblaCarousel({
    loop: false,
    align: "start",
  });

  const [selected_index, setSelectedIndex] = useState(0);
  const [scroll_snaps, setScrollSnaps] = useState<number[]>([]);

  const scrollTo = useCallback(
    (index: number) => {
      embla_api?.scrollTo(index);
    },
    [embla_api],
  );

  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!embla_api) return;

    setScrollSnaps(embla_api.scrollSnapList());
    setSelectedIndex(embla_api.selectedScrollSnap());

    embla_api.on("select", onSelect);
    embla_api.on("reInit", () => {
      setScrollSnaps(embla_api.scrollSnapList());
      setSelectedIndex(embla_api.selectedScrollSnap());
    });

    return () => {
      embla_api.off("select", onSelect);
    };
  }, [embla_api, onSelect, variant_medias_with_title.length]);

  return (
    <div className="relative order-2 lg:hidden">
      {/* viewport */}
      <div className="overflow-hidden" ref={embla_ref}>
        <div className="flex">
          {variant_medias_with_title.map(({ media, image_title }, index) => (
            <div key={index} className="min-w-0 flex-[0_0_85%] pr-4">
              <div className="relative aspect-square overflow-hidden rounded-lg border border-neutral-300">
                <Image
                  src={media.url}
                  alt={image_title}
                  fill
                  sizes="(max-width: 1024px) 85vw"
                  priority={index === 0}
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DOTS (same pattern as your Campaign) */}
      <div className="mt-2 flex items-center justify-center gap-2">
        {scroll_snaps.map((_, index) => {
          const active = index === selected_index;

          return (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`relative rounded-full transition-all duration-300 ${
                active
                  ? "h-1.5 w-8 bg-orange-500"
                  : "h-1.5 w-3 bg-black/30 hover:bg-black/50"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default withProductGalleryFunctionality(MobileProductGallary);
