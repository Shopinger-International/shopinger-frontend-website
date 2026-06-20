import { useCallback } from "react";
import Link from "next/link";
import type { FC } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// types
import type { ICategoryRecommendation } from "@/hooks/axios/home/use-feed.hook";

import CategoryCard from "@/components/home/category/category-card.component";

const CategorySection: FC<{
  category_recommendations: Array<ICategoryRecommendation>;
}> = ({ category_recommendations }) => {
  // Initialize Embla with your configurations (similar to slidesPerView="auto" and spaceBetween)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true, // Allows smooth, grab-and-flick scrolling like Swiper's grabCursor
    containScroll: "trimSnaps",
  });

  // Navigation handlers
  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section>
      <div className="max-w-8xl mx-auto space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-3xl">
            Categories you might like
          </h2>
          <Link
            href="/testing"
            className="text-sm font-semibold text-orange-500 hover:underline md:text-base"
          >
            View All
          </Link>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={scrollPrev}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            {/* Embla Container */}
            <div className="flex gap-4">
              {category_recommendations.map((categroy_recommendation, i) => (
                <div key={i} className="min-w-0 shrink-0 grow-0 select-none">
                  <CategoryCard {...categroy_recommendation} />
                </div>
              ))}
            </div>
          </div>

          {/* Right arrow */}
          <button
            onClick={scrollNext}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 p-3 text-white shadow-lg transition-all hover:scale-110 hover:bg-orange-600 md:flex"
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
