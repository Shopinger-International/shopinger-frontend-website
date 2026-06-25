import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

// types
import type { FC } from "react";
import type { IResponse } from "@/hooks/axios/home/use-feed.hook";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// local components
import BestDealsCard from "@/components/home/best-deals/best-deals-card.component";

type IProps = {
  products: IResponse["data"]["deals_of_the_day"];
};

const BestDeals: FC<IProps> = ({ products }) => {
  const [cta_state, updateCtaState] = useState<{
    can_scroll_prev?: boolean;
    can_scroll_next?: boolean;
  }>({});
  const [embla_ref, embla_api] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  });

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (embla_api) embla_api.scrollPrev();
  }, [embla_api]);

  const scrollNext = useCallback(() => {
    if (embla_api) embla_api.scrollNext();
  }, [embla_api]);

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
    <section className="bg-orange-100">
      <div className="max-w-8xl mx-auto p-4">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 md:text-3xl">
            Deals of the day
          </h2>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative mb-2">
          {/* Left Arrow */}
          <button
            onClick={scrollPrev}
            disabled={!cta_state.can_scroll_prev}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 disabled:bg-orange-300 md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={embla_ref}>
            {/* Embla Container */}
            <div className="flex gap-4">
              {products.map((product, i) => (
                <div key={i} className="w-auto shrink-0">
                  <BestDealsCard {...product} />
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollNext}
            disabled={!cta_state.can_scroll_next}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 disabled:bg-orange-300 md:flex"
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <Link
          href="/fashion"
          className="inline-block font-semibold text-orange-500 hover:underline"
        >
          See All Offers
        </Link>
      </div>
    </section>
  );
};

export default BestDeals;
