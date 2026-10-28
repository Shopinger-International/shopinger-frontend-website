import { useState, useEffect, useCallback, ReactNode } from "react";
import Link from "next/link";
import type { FC } from "react";
import useEmblaCarousel from "embla-carousel-react";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// components & types
import HomeProductCard, {
  type IHomeProduct,
} from "@/components/home/home-product-card.component";

// hooks & helpers
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import clsx from "clsx";

interface IHomeProductRowProps<T = IHomeProduct> {
  title: string;
  subtitle?: string;
  products: Array<T>;
  view_all_href?: string;
  background_style?: string;
  className?: string;
  item_class_name?: string;
  CardComponent?: FC<{ product: T }>;
  renderCard?: (product: T) => ReactNode;
}

const HomeProductRow = <T extends IHomeProduct = IHomeProduct>({
  title,
  subtitle,
  products,
  view_all_href,
  background_style,
  className,
  item_class_name,
  CardComponent,
  renderCard,
}: IHomeProductRowProps<T>) => {
  const [cta_state, setCtaState] = useState<{
    can_scroll_prev?: boolean;
    can_scroll_next?: boolean;
  }>({});
  const is_mobile = useIsMobile();

  const [embla_ref, embla_api] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const updateScrollButtonsState = useCallback(() => {
    if (!embla_api) return;
    setCtaState({
      can_scroll_prev: embla_api.canScrollPrev(),
      can_scroll_next: embla_api.canScrollNext(),
    });
  }, [embla_api]);

  const scrollPrev = useCallback(() => {
    if (!embla_api) return;
    embla_api.scrollPrev();
  }, [embla_api]);

  const scrollNext = useCallback(() => {
    if (!embla_api) return;
    embla_api.scrollNext();
  }, [embla_api]);

  useEffect(() => {
    if (!embla_api) return;

    updateScrollButtonsState();

    embla_api.on("select", updateScrollButtonsState);
    embla_api.on("scroll", updateScrollButtonsState);
    embla_api.on("settle", updateScrollButtonsState);
    embla_api.on("reInit", updateScrollButtonsState);

    return () => {
      embla_api.off("select", updateScrollButtonsState);
      embla_api.off("scroll", updateScrollButtonsState);
      embla_api.off("settle", updateScrollButtonsState);
      embla_api.off("reInit", updateScrollButtonsState);
    };
  }, [embla_api, updateScrollButtonsState]);

  if (!products || products.length === 0) return null;

  const section_id_slug = title.toLowerCase().replace(/\s+/g, "-");

  return (
    <section
      aria-labelledby={`home-row-${section_id_slug}`}
      className={clsx(
        "group/row relative rounded-2xl p-3 transition-all sm:p-4",
        background_style ?? "bg-white",
        className,
      )}
    >
      {/* Header Section */}
      <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
        <div>
          <h2
            id={`home-row-${section_id_slug}`}
            className="text-base font-bold tracking-tight text-gray-900 sm:text-lg md:text-xl"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {view_all_href && (
          <Link
            href={view_all_href}
            title={`View all ${title}`}
            className="text-brand text-xs font-medium transition-colors hover:text-orange-600 hover:underline sm:text-sm"
          >
            See All →
          </Link>
        )}
      </div>

      {/* Horizontal Scrollable Carousel Container */}
      <div className="relative">
        {/* Left Scroll Navigation Button */}
        {cta_state.can_scroll_prev && (
          <button
            type="button"
            onClick={scrollPrev}
            className="hover:bg-brand hover:border-brand absolute top-1/2 left-0 z-20 hidden size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:text-white active:scale-95 sm:-left-3 sm:size-9 md:flex"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Embla Viewport */}
        <div className="touch-pan-y overflow-hidden rounded-xl" ref={embla_ref}>
          <ul className="flex gap-2.5 py-1 sm:gap-3.5">
            {products.map((product, idx) => {
              const item_key = `home-prod-${product.product_id ?? idx}-${product.variant_id ?? idx}`;
              return (
                <li
                  key={item_key}
                  className={clsx(
                    "w-30 min-w-30 shrink-0 grow-0 select-none sm:w-36 sm:min-w-36 md:w-44 md:min-w-44",
                    item_class_name,
                  )}
                >
                  {renderCard ? (
                    renderCard(product)
                  ) : CardComponent ? (
                    <CardComponent product={product} />
                  ) : (
                    <HomeProductCard product={product} />
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right Scroll Navigation Button */}
        {cta_state.can_scroll_next && (
          <button
            type="button"
            onClick={scrollNext}
            className="hover:bg-brand hover:border-brand absolute top-1/2 right-0 z-20 hidden size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:text-white active:scale-95 sm:-right-3 sm:size-9 md:flex"
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>
        )}
      </div>
    </section>
  );
};

export default HomeProductRow;
