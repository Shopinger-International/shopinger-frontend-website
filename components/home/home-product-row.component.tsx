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
    slidesToScroll: is_mobile ? 2 : 4,
  });

  const updateScrollButtonsState = useCallback(() => {
    if (!embla_api) return;
    const container = embla_api.rootNode();
    const canPrev =
      embla_api.canScrollPrev() || (container ? container.scrollLeft > 5 : false);
    const canNext =
      embla_api.canScrollNext() &&
      (container
        ? Math.ceil(container.scrollLeft + container.clientWidth) <
          container.scrollWidth - 10
        : true);

    setCtaState({
      can_scroll_prev: canPrev,
      can_scroll_next: canNext,
    });
  }, [embla_api]);

  const scrollPrev = useCallback(() => {
    if (!embla_api) return;
    embla_api.scrollPrev();
    const container = embla_api.rootNode();
    if (container && container.scrollLeft > 0) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  }, [embla_api]);

  const scrollNext = useCallback(() => {
    if (!embla_api) return;
    embla_api.scrollNext();
    const container = embla_api.rootNode();
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  }, [embla_api]);

  useEffect(() => {
    if (!embla_api) return;

    updateScrollButtonsState();
    const container = embla_api.rootNode();

    embla_api.on("select", updateScrollButtonsState);
    embla_api.on("scroll", updateScrollButtonsState);
    embla_api.on("settle", updateScrollButtonsState);
    embla_api.on("reInit", updateScrollButtonsState);

    if (container) {
      container.addEventListener("scroll", updateScrollButtonsState, {
        passive: true,
      });
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtonsState);
      }
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
        "relative rounded-2xl p-3 sm:p-4 transition-all group/row",
        background_style ?? "bg-white border border-gray-100",
        className,
      )}
    >
      {/* Header Section */}
      <div className="mb-3 flex items-center justify-between gap-4 sm:mb-4">
        <div>
          <h2
            id={`home-row-${section_id_slug}`}
            className="text-base font-extrabold text-gray-900 sm:text-lg md:text-xl tracking-tight"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-500 font-medium sm:text-sm">
              {subtitle}
            </p>
          )}
        </div>

        {view_all_href && (
          <Link
            href={view_all_href}
            title={`View all ${title}`}
            className="text-xs font-bold text-brand transition-colors hover:text-orange-600 sm:text-sm hover:underline"
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
            className="absolute left-0 sm:-left-3 top-1/2 -translate-y-1/2 z-20 flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-brand hover:text-white hover:border-brand active:scale-95"
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
        )}

        {/* Embla Viewport */}
        <div
          className="overflow-x-auto no-scrollbar rounded-xl touch-pan-x"
          ref={embla_ref}
        >
          <ul className="flex gap-2.5 sm:gap-3.5 py-1">
            {products.map((product, idx) => {
              const item_key = `home-prod-${product.product_id ?? idx}-${product.variant_id ?? idx}`;
              return (
                <li
                  key={item_key}
                  className="w-40 min-w-40 sm:w-48 sm:min-w-48 md:w-52 md:min-w-52 shrink-0 grow-0 select-none"
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
            className="absolute right-0 sm:-right-3 top-1/2 -translate-y-1/2 z-20 flex size-8 sm:size-9 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white/95 text-gray-800 shadow-md backdrop-blur-xs transition-all hover:scale-110 hover:bg-brand hover:text-white hover:border-brand active:scale-95"
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
