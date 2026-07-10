import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
// types
import type { FC } from "react";
import type { EmblaCarouselType } from "embla-carousel";

// types
import type { IVariantMediaWithTitle } from "@/hoc/product/with-product-gallery-functionality.hoc";

// hoc
import withProductGalleryFunctionality from "@/hoc/product/with-product-gallery-functionality.hoc";

// hooks
import useEmblaCarousel from "embla-carousel-react";
import useIsWishlisted from "@/hooks/axios/wishlist/use-is-wishlisted";
import useAddToWishlistMutation from "@/hooks/axios/wishlist/use-add-to-wishlist-mutation.hook";
import useRemoveFromWishlistMutation from "@/hooks/axios/wishlist/use-remove-from-wishlist-mutation.hook";

// helpers
import clsx from "clsx";

// icons
import { Heart } from "lucide-react";

type IProps = {
  variant_id: number;
  variant_medias_with_title: IVariantMediaWithTitle[];
};

const MobileProductGallary: FC<IProps> = ({
  variant_medias_with_title,
  variant_id,
}) => {
  const add_to_wishlist_mutation = useAddToWishlistMutation();
  const remove_from_wishlist_mutation = useRemoveFromWishlistMutation();
  const { data: wishlist_data } = useIsWishlisted({ variant_id });
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
      <button
        type="button"
        aria-label={
          wishlist_data?.is_wishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        title={
          wishlist_data?.is_wishlisted
            ? "Remove from wishlist"
            : "Add to wishlist"
        }
        className="absolute top-3 left-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-white"
        disabled={
          add_to_wishlist_mutation.isPending ||
          remove_from_wishlist_mutation.isPending
        }
        onClick={() => {
          wishlist_data?.is_wishlisted
            ? remove_from_wishlist_mutation.mutate({ variant_id })
            : add_to_wishlist_mutation.mutate({ variant_id });
        }}
      >
        <Heart
          aria-hidden={true}
          className={clsx(
            "size-5 text-orange-500",
            wishlist_data?.is_wishlisted && "fill-orange-500",
          )}
          strokeWidth={2}
        />
      </button>
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

export default withProductGalleryFunctionality<
  Omit<IProps, "variant_medias_with_title">
>(MobileProductGallary);
