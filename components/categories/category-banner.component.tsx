import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

//icons
import { ChevronLeft, ChevronRight } from "lucide-react";

//helpers
import { cn } from "@/lib/utils";

interface IBanner {
  id: string;
  image: string;
  href?: string;
  alt?: string;
}

interface CategoryBannerSectionProps {
  banners: IBanner[];
  className?: string;
}

export function CategoryBannerSection({
  banners,
  className,
}: CategoryBannerSectionProps) {
  const container_ref = useRef<HTMLDivElement>(null);
  const [active_index, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    if (!container_ref.current) return;

    const width = container_ref.current.clientWidth;

    container_ref.current.scrollBy({
      left: direction === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  if (!banners?.length) return null;

  return (
    <section
      className={cn(
        "mb-0 w-full min-w-0 overflow-hidden bg-white py-3 md:px-6",
        className,
      )}
    >
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
          ref={container_ref}
          onScroll={() => {
            if (!container_ref.current) return;

            const index = Math.round(
              container_ref.current.scrollLeft /
                container_ref.current.clientWidth,
            );

            setActiveIndex(index);
          }}
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

      <div className="mt-2 flex items-center justify-center gap-1.5">
        {banners.map((banner, index) => (
          <button
            key={banner.id}
            type="button"
            aria-label={`Go to banner ${index + 1}`}
            onClick={() => {
              container_ref.current?.scrollTo({
                left: index * container_ref.current.clientWidth,
                behavior: "smooth",
              });
            }}
            className={`h-1.5 rounded-full transition-all duration-200 ${
              index === active_index ? "w-5 bg-orange-500" : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
