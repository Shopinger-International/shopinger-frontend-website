import Image from "next/image";
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
  className?: string;
};

const ProductCard: FC<IProps> = ({ title, thumbnail, selling_price, mrp, className }) => {
  const discount_percentage = Math.round(((mrp - selling_price) / mrp) * 100);
  return (
    <article className={cn("min-h-84 w-60 shrink-0 rounded-lg border border-gray-300 p-4", className)}>
      <div className="relative flex h-38 w-auto justify-center">
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
        <span aria-hidden="true">4.6</span>
        <span aria-hidden="true" className="text-orange-500">
          ★
        </span>
        <span className="sr-only">out of 5 stars</span>
      </p>

      <div className="my-3 flex justify-center">
        <span aria-hidden="true" className="h-0.5 w-6 bg-pink-500"></span>
      </div>

      <h3 className="mb-1.5 truncate text-base font-medium text-gray-800">
        {title}
      </h3>
      {!!discount_percentage && (
        <p
          className="font-sm mb-1.5 font-medium text-orange-500"
          aria-label={`${discount_percentage} percent discount`}
        >
          {discount_percentage}% off
        </p>
      )}

      <div className="flex items-center gap-2 text-lg text-gray-900">
        <span
          aria-label={`Original price ₹${mrp}`}
          className="text-gray-600 line-through"
        >
          ₹{mrp}
        </span>

        <span
          aria-label={`Discounted price ₹${selling_price}`}
          className="font-semibold"
        >
          ₹{selling_price}
        </span>
      </div>
    </article>
  );
};

export default ProductCard;
