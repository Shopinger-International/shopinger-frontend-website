import Image from "next/image";
import Link from "next/link";
// types
import type { FC } from "react";
import type { IResponse } from "@/hooks/axios/home/use-feed.hook";

// helpers
import { generateSlug } from "@/helpers/product.helper";

const BestDealsCard: FC<IResponse["data"]["deals_of_the_day"][number]> = ({
  title,
  product_id,
  variant_id,
  media_url,
  discount,
}) => {
  return (
    <Link
      href={`/${generateSlug(title)}/p/${product_id}/${variant_id}`}
      className="group block w-60 space-y-3 focus-visible:outline-none md:w-72"
    >
      <div className="overflow-hidden rounded-2xl border border-gray-100/50 bg-white shadow-md transition-all duration-300 group-hover:-translate-y-0.5 group-focus-visible:ring-2 group-focus-visible:ring-orange-500 group-focus-visible:ring-offset-2">
        <div className="flex aspect-square items-center justify-center bg-linear-to-br from-orange-50/60 to-orange-100/20 p-4 md:p-6">
          <div className="relative h-full w-full overflow-hidden rounded-xl">
            {/* Swapped standard img for Next.js Image component */}
            <Image
              src={media_url}
              alt="Yellow floral dress"
              fill
              sizes="(max-width: 768px) 240px, 288px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              priority={false}
            />
          </div>
        </div>
      </div>

      <div className="px-1">
        <p className="truncate text-sm leading-snug font-semibold tracking-tight text-gray-900 transition-colors group-hover:text-orange-600 md:text-base">
          Up to {Math.floor(discount)}% off | {title}
        </p>
      </div>
    </Link>
  );
};

export default BestDealsCard;
