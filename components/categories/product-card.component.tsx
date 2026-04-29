// types
import type { FC } from "react";
import type IMedia from "@/types/media";

// next
import Image from "next/image";
import Link from "next/link";

type IProps = {
  title: string;
  src: string;
  product_thumbnail: IMedia;
  selling_price: number;
  mrp: number;
  discount_percentage: number;
  is_new: boolean;
};

const ProductCard: FC<IProps> = ({
  title,
  src,
  product_thumbnail,
  selling_price,
  mrp,
  discount_percentage,
  is_new,
}) => {
  return (
    <Link
      href={`${src}`}
      className="group block overflow-hidden rounded-2xl border border-gray-300 bg-white"
    >
      {/* image section */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product_thumbnail.url}
          alt={title}
          fill
          className="object-contain object-top"
          sizes="300px"
        />

        {/* badges */}
        <div className="absolute flex w-full justify-between p-2">
          {!!discount_percentage && (
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
              -{discount_percentage}%
            </span>
          )}

          {is_new && (
            <span className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-orange-500">
              New
            </span>
          )}
        </div>
      </div>

      {/* content */}
      <div className="space-y-3 p-4">
        {/* title */}
        <h3 className="line-clamp-2 text-sm font-medium text-gray-800 transition-colors group-hover:text-black">
          {title}
        </h3>

        {/* rating */}
        {/* <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />

            <span className="text-sm font-medium text-gray-700">{rating}</span>
          </div>

          <span className="text-sm text-gray-500">({reviews} reviews)</span>
        </div> */}

        {/* price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ₹{selling_price.toLocaleString()}
          </span>

          {!!discount_percentage && (
            <span className="text-sm text-gray-400 line-through">
              ₹{mrp?.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
