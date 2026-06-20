import { FC, useCallback } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

// types
import type { IResponse } from "@/hooks/axios/home/use-feed.hook";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

// local components
import BestDealsCard from "@/components/home/best-deals/best-deals-card.component";

type IProps = {
  products: IResponse["data"]["deals_of_the_day"];
};

const BestDeals: FC<IProps> = ({ products }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true, // Emulates Swiper's free-flowing auto slides view
  });

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <section className="bg-[#FFE2D0]">
      <div className="max-w-8xl mx-auto p-4">
        {/* Section Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-gray-900 md:text-3xl">
            Deals of the day
          </h2>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative mb-2">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 -left-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-white p-3 shadow-lg transition-all hover:scale-110 hover:bg-gray-50 md:flex"
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Embla Viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
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
            onClick={handleNext}
            className="absolute top-1/2 -right-2 z-10 hidden -translate-y-10 items-center justify-center rounded-full bg-white p-3 text-gray-900 shadow-lg transition-all hover:scale-110 hover:bg-gray-50 md:flex"
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
