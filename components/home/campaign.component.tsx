import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

// types
import type { FC } from "react";
import type { EmblaCarouselType } from "embla-carousel";

// hooks
import useEmblaCarousel from "embla-carousel-react";
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";

// external packages
import Autoplay from "embla-carousel-autoplay";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

const Campaign: FC = () => {
  const { data: campaigns = [] } = useAllCamapigns();
  const [embla_ref, emabla_api] = useEmblaCarousel({ loop: true }, [
    Autoplay(),
  ]);

  const [selected_index, setSelectedIndex] = useState(0);
  const [scroll_snaps, setScrollSnaps] = useState<Array<number>>([]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emabla_api) emabla_api.scrollTo(index);
    },
    [emabla_api],
  );
  const onSelect = useCallback((api: EmblaCarouselType) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);
  useEffect(() => {
    if (!emabla_api) return;

    // Initialize snaps and listeners
    setScrollSnaps(emabla_api.scrollSnapList());
    emabla_api.on("select", onSelect);
    emabla_api.on("reInit", () => {
      setScrollSnaps(emabla_api.scrollSnapList());
      onSelect(emabla_api);
    });

    emabla_api.reInit();
    emabla_api.plugins().autoplay?.play();

    return () => {
      emabla_api.off("select", onSelect);
    };
  }, [emabla_api, campaigns.length, onSelect]);
  return (
    <section
      aria-labelledby="featured-campaigns"
      className="relative flex flex-col gap-2"
    >
      <h2 id="featured-campaigns" className="sr-only">
        Featured Campaigns
      </h2>
      <div ref={embla_ref} className="overflow-hidden">
        <ul className="-ml-4 flex">
          {campaigns
            .sort((a, b) => b.priority - a.priority)
            .map((campaign, index) => (
              <li
                key={campaign.id}
                className="min-w-0 flex-[0_0_100%] pl-4 md:flex-[0_0_40%] lg:flex-[0_0_35%]"
              >
                <Link href={`/campaign/${campaign.id}/${campaign.slug}`}>
                  <article className="group relative">
                    <h3 className="sr-only">{campaign.title}</h3>
                    <p className="sr-only">{campaign.description}</p>
                    <div className="relative aspect-2/1 overflow-hidden rounded-xl">
                      <Image
                        priority={index == 0}
                        sizes="(max-width: 640px) 800px, 600px"
                        src={campaign.banner}
                        alt={`${campaign.title} Campaign banner`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </article>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      <button
        onClick={() => emabla_api?.scrollPrev()}
        className="absolute top-1/2 left-4 z-10 hidden -translate-y-1/2 rounded-full bg-black/20 p-2 backdrop-blur transition hover:bg-black/60 lg:inline-block"
      >
        <ChevronLeft className="size-4 text-white lg:size-6" />
      </button>

      <button
        onClick={() => emabla_api?.scrollNext()}
        className="absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 rounded-full bg-black/20 p-2 backdrop-blur transition hover:bg-black/60 lg:inline-block"
      >
        <ChevronRight className="size-4 text-white lg:size-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/10 px-3 py-1 backdrop-blur-md">
        {scroll_snaps.map((_, index) => {
          const active = index === selected_index;

          return (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`relative overflow-hidden rounded-full transition-all duration-300 ${active ? "h-2.5 w-8" : "h-2.5 w-2.5 opacity-60 hover:opacity-100"} `}
            >
              <span
                className={`absolute inset-0 rounded-full transition-all duration-300 ${
                  active
                    ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    : "bg-white/60"
                } `}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Campaign;
