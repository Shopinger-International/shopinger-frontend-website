import Image from "next/image";
import { ArrowDown } from "lucide-react";
// types
import type { FC } from "react";
import type IMedia from "@/types/media";
import { cn } from "@/lib/utils";

type IProps = {
  title: string;
  thumbnail: IMedia;
  thumbnail_title: string;
  selling_price: number;
  mrp: number;
  average_rating:number;
  className?: string;
};

const ProductCard: FC<IProps> = ({ title, thumbnail, selling_price, mrp,average_rating, className }) => {
  const discount_percentage = Math.round(((mrp - selling_price) / mrp) * 100);
  return (
    <article
      className={cn(
        "min-h-84 rounded-lg border border-gray-300 p-4",
        className,
      )}
    >
      <div className="relative flex h-38 justify-center">
        <Image
          src={thumbnail.url}
          alt=""
          sizes={"300px"}
          aria-hidden={true}
          fill={true}
          className="object-contain"
        />
      </div>

      <p className="mt-4 flex items-center gap-1 text-sm text-gray-700">
        <span aria-hidden="true">{average_rating}</span>
        <span aria-hidden="true" className="text-brand">
          ★
        </span>
        <span className="sr-only">out of 5 stars</span>
      </p>

      <div className="my-3 flex justify-center">
        <span aria-hidden="true" className="h-0.5 w-6 bg-pink-500"></span>
      </div>

      <h3 className="mb-1.5 truncate text-base font-semibold text-gray-800">
        {title}
      </h3>
      {!!discount_percentage && (
        <p
          className="font-sm mb-1.5 font-medium text-brand inline-flex items-center gap-0.5"
          aria-label={`${discount_percentage} percent discount`}
        >
          <span>{discount_percentage}%</span>
          <ArrowDown className="size-3.5 shrink-0 text-brand" strokeWidth={3.5} />
        </p>
      )}

      <div className="flex flex-col min-w-0 gap-0 text-gray-900">
        <span
          aria-label={`Discounted price ₹${selling_price}`}
          className="text-sm sm:text-base md:text-lg font-black text-gray-900"
        >
          ₹{selling_price}
        </span>

        {mrp > selling_price && (
          <span
            aria-label={`Original price ₹${mrp}`}
            className="text-2xs sm:text-xs font-medium text-gray-400 line-through"
          >
            ₹{mrp}
          </span>
        )}
      </div>
    </article>
  );
};

export default ProductCard;
