import Link from "next/link";
import Image from "next/image";

// types
import type { FC } from "react";

// hooks
import useEmblaCarousel from "embla-carousel-react";
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";

// external packages
import Autoplay from "embla-carousel-autoplay";

// icons
import { ChevronLeft, ChevronRight } from "lucide-react";

const Campaign: FC = () => {
  const { data: campaigns = [] } = useAllCamapigns();
  const [embla_ref, emabla_api] = useEmblaCarousel(
    { loop: true, align: "start" },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

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
        aria-label="Previous campaign"
      >
        <ChevronLeft className="size-4 text-white lg:size-6" />
      </button>

      <button
        onClick={() => emabla_api?.scrollNext()}
        className="absolute top-1/2 right-4 z-10 hidden -translate-y-1/2 rounded-full bg-black/20 p-2 backdrop-blur transition hover:bg-black/60 lg:inline-block"
        aria-label="Next campaign"
      >
        <ChevronRight className="size-4 text-white lg:size-6" />
      </button>
    </section>
  );
};

export default Campaign;
