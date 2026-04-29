// types
import type { FC } from "react";
import type IMedia from "@/types/media";

// next
import Image from "next/image";
import Link from "next/link";

// icons
import { Heart } from "lucide-react";

// local components
import Rating from "@/components/common/rating.component";

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
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Image
          src={product_thumbnail.url}
          alt={title}
          fill
          className="object-contain object-top"
          sizes="300px"
        />

        <div className="absolute flex w-full items-center justify-between p-2">
          {!!discount_percentage && (
            <span className="rounded-full border border-gray-300 bg-orange-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              -{discount_percentage}%
            </span>
          )}
          <button className="shrink-0 rounded-full border border-gray-300 bg-white p-1 shadow-sm">
            <Heart className="size-6 text-orange-500" strokeWidth={2} />
          </button>
        </div>
        {is_new && (
          <span className="absolute right-0 bottom-2 overflow-hidden bg-orange-500 px-3 py-1 text-[10px] font-bold text-white shadow">
            NEW
            <span className="absolute top-0 -left-2 h-full w-3 skew-x-[-20deg] bg-orange-600" />
          </span>
        )}
      </div>

      {/* content */}
      <div className="space-y-3 p-4">
        {/* title */}
        <h3 className="line-clamp-3 font-medium text-gray-900">{title}</h3>

        {/* rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Rating
              totalStars={5}
              custom_rating={2}
              onChange={() => {}}
              size={12}
              gap={0.5}
            />
          </div>
        </div>

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
