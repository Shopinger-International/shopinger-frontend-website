import Image from "next/image";
// types
import type { FC } from "react";
import type IMedia from "@/types/media";

type IProps = {
  title: string;
  thumbnail: IMedia;
  thumbnail_title: string;
  selling_price: number;
  mrp: number;
};

const ProductCard: FC<IProps> = ({ title, thumbnail, selling_price, mrp }) => {
  const discount_percentage = Math.round(((mrp - selling_price) / mrp) * 100);
  return (
    <article className="min-h-84 w-60 shrink-0 rounded-lg border border-gray-300 p-4">
      <div className="relative flex h-38 w-auto justify-center">
        <Image
          src={thumbnail.url}
          alt=""
          sizes = {"300px"}
          aria-hidden={true}
          fill={true}
          className="object-contain"
        />
      </div>

      <div
        className="mt-4 flex items-center gap-1 text-sm text-gray-700"
        aria-label="Rated 4.6 out of 5 stars"
      >
        <span aria-hidden="true">4.6</span>
        <span aria-hidden="true" className="text-orange-500">
          ★
        </span>
      </div>

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
          ${discount_percentage}% off
        </p>
      )}

      <div className="flex items-center gap-2 text-lg font-semibold text-gray-900">
        <span
          aria-label={`Original price ₹${mrp}`}
          className="text-gray-400 line-through"
        >
          ₹{mrp}
        </span>

        <span aria-label={`Discounted price ₹${selling_price}`}>
          ₹{selling_price}
        </span>
      </div>
    </article>
  );
};

export default ProductCard;
