import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// types
import { useEffect, type FC } from "react";
import type { IProductRecommendation } from "@/hooks/axios/home/use-feed.hook";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// hooks
import useEmblaCarousel from "embla-carousel-react";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";

// helpers
import clsx from "clsx";
import { generateSlug } from "@/helpers/product.helper";

type IProps = {
  title: string;
  products: Array<IProductRecommendation>;
  background_style: string;
};
const ProductRow: FC<IProps> = ({ title, products, background_style }) => {
  const [cta_state, updateCtaState] = useState<{
    can_scroll_prev?: boolean;
    can_scroll_next?: boolean;
  }>({});
  const is_mobile = useIsMobile();

  const [embla_ref, embla_api] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
    slidesToScroll: is_mobile ? 1 : 4,
  });

  useEffect(() => {
    const update = () => {
      updateCtaState({
        can_scroll_prev: embla_api?.canScrollPrev(),
        can_scroll_next: embla_api?.canScrollNext(),
      });
    };
    update();
    embla_api?.on("select", update);
    embla_api?.on("reInit", update);

    return () => {
      embla_api?.off("select", update);
      embla_api?.off("reInit", update);
    };
  }, [embla_api]);

  return (
    <section
      aria-labelledby={`section-${title}`}
      className={clsx(
        "space-y-2 rounded-xl border border-gray-300 p-3",
        background_style,
      )}
    >
      <div className="flex items-center justify-between">
        <h2
          id={`section-${title}`}
          className="text-sm font-semibold text-gray-900 sm:text-lg"
        >
          {title}
        </h2>

        {products.length > 4 && (
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => embla_api?.scrollPrev()}
              disabled={!cta_state.can_scroll_prev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white transition hover:bg-orange-500 hover:text-white disabled:text-gray-300 disabled:hover:bg-white"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => embla_api?.scrollNext()}
              disabled={!cta_state.can_scroll_next}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white transition hover:bg-orange-500 hover:text-white disabled:text-gray-300 disabled:hover:bg-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden" ref={embla_ref}>
        <ul className="flex gap-5">
          {products.map(({ product_id, variant_id, title, media_url }) => (
            <li
              className="group w-40 shrink-0 sm:w-55"
              key={`product-${product_id}-${variant_id}`}
            >
              <Link
                key={`${product_id}-${variant_id}`}
                title={`View ${title}`}
                href={`/${generateSlug(title)}/p/${product_id}/${variant_id}`}
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-300">
                  <Image
                    src={media_url}
                    alt={`${title} product image`}
                    sizes="(max-width: 640px) 220px, 160px"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="mt-3 px-1">
                  <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 sm:text-sm">
                    {title}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default ProductRow;
