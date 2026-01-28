import Image from "next/image";
import type { FC } from "react";
import { CheckCircle } from "lucide-react";

const marqueeItems = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1699",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070",
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1480",
  "https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=987",
  "https://images.unsplash.com/photo-1686152058759-a75e01338cca?w=900&q=60",
];

const ProductMarquee: FC = () => {
  return (
    <section className="rounded-2xl bg-linear-to-b from-gray-50 to-white px-4 py-3 shadow-sm ring-1 ring-black/5 sm:px-5 sm:py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        {/* Left Info Block */}
        <div className="flex shrink-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-semibold text-gray-900">
              Delivered Products
            </span>
          </div>
          <span className="text-xs text-gray-500">
            Recently delivered to customers
          </span>
        </div>

        {/* Divider (desktop only) */}
        <div className="hidden h-8 w-px bg-gray-200 sm:block" />

        {/* Marquee Rail */}
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-marquee flex w-max items-center gap-12 will-change-transform hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((src, index) => (
              <div
                key={index}
                className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                <Image
                  src={src}
                  alt="product"
                  fill
                  className="object-cover object-center"
                />

                {/* Subtle glass overlay */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
                </div>
              </div>
            ))}
          </div>

          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 lg:bg-linear-to-r lg:from-white lg:via-white/70 lg:to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 lg:bg-linear-to-l lg:from-white lg:via-white/70 lg:to-transparent" />
        </div>
      </div>
    </section>
  );
};

export default ProductMarquee;
