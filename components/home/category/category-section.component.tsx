import { useCallback, useState, useEffect } from "react";
// types
import type { FC } from "react";
// hooks
import useEmblaCarousel from "embla-carousel-react";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// components

// types
import type { ICategoryRecommendation } from "@/hooks/axios/home/use-feed.hook";

import CategoryCard from "@/components/home/category/category-card.component";

const CategorySection: FC<{
  category_recommendations: Array<ICategoryRecommendation>;
}> = ({ category_recommendations }) => {
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
    <section aria-labelledby="recommended-categories">
      <div className="max-w-8xl mx-auto space-y-6 p-4">
        {/* Header */}
        <h2
          id="recommended-categories"
          className="text-lg font-semibold text-gray-900 md:text-xl"
        >
          Categories you might like
        </h2>
        <p className="sr-only">
          Browse categories recommended for you based on popular and relevant
          products.
        </p>

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={scrollPrev}
            disabled={!cta_state.can_scroll_prev}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white p-3 shadow-sm hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-gray-50 md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={embla_ref}>
            {/* Embla Container */}
            <ul className="flex gap-4">
              {category_recommendations.map(
                (categroy_recommendation, index) => (
                  <li
                    key={`category-section-${index}`}
                    className="min-w-0 shrink-0 grow-0 select-none"
                  >
                    <CategoryCard {...categroy_recommendation} />
                  </li>
                ),
              )}
            </ul>
          </div>

          {/* Right arrow */}
          <button
            onClick={scrollNext}
            disabled={!cta_state.can_scroll_next}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-white p-3 shadow-sm hover:bg-orange-500 hover:text-white disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-gray-50 md:flex"
            aria-label="Next slide"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
