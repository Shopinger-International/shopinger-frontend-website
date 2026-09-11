import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface IBanner {
  id: string;
  image: string;
  href?: string;
  alt?: string;
}

interface CategoryBannerSectionProps {
  banners: IBanner[];
}

export function CategoryBannerSection({ banners }: CategoryBannerSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;

    containerRef.current.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  if (!banners?.length) return null;

  return (
    <section className="w-full min-w-0 overflow-hidden bg-white px-4 py-3 md:px-6">
      <div className="group relative w-full">
        {/* Left button */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous banner"
            className="absolute top-1/2 left-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105 md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {/* Banners */}
        <div
          ref={containerRef}
          className="no-scrollbar flex w-full min-w-0 snap-x snap-mandatory gap-0 overflow-x-auto scroll-smooth"
        >
          {banners.map((banner) => {
            const content = (
              <div className="relative h-[150px] w-full shrink-0 snap-start overflow-hidden rounded-xl bg-gray-100 sm:h-[180px] md:h-[220px] lg:h-[260px]">
                <Image
                  src={banner.image}
                  alt={banner.alt ?? "Category banner"}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-top-left"
                />
              </div>
            );

            return banner.href ? (
              <Link
                key={banner.id}
                href={banner.href}
                className="block w-full shrink-0"
              >
                {content}
              </Link>
            ) : (
              <div key={banner.id} className="w-full shrink-0">
                {content}
              </div>
            );
          })}
        </div>

        {/* Right button */}
        {banners.length > 1 && (
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next banner"
            className="absolute top-1/2 right-3 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-105 md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {banners.map((banner, index) => (
            <span
              key={banner.id}
              className={`h-1.5 rounded-full ${
                index === 0 ? "w-5 bg-orange-500" : "w-1.5 bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
