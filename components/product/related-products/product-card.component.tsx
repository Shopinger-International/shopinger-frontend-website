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

const ProductCard: FC<IProps> = ({
  title,
  thumbnail,
  thumbnail_title,
  selling_price,
  mrp,
}) => {
  return (
    <div className="w-60 shrink-0 rounded-lg border border-gray-300 p-4">
      {/* Product Image */}
      <div className="flex justify-center">
        <img
          src={thumbnail.url}
          alt={thumbnail_title}
          className="h-38 object-contain"
        />
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-1 text-sm text-gray-700">
        <span>4.6</span>
        <span className="text-orange-500">★</span>
      </div>

      {/* Divider */}
      <div className="my-3 flex justify-center">
        <span className="h-0.5 w-6 bg-pink-500"></span>
      </div>

      {/* Product Name */}
      <h3 className="truncate text-base font-medium text-gray-800">{title}</h3>

      {/* Price */}
      <div className="mt-2 flex items-center gap-2 text-lg font-semibold text-gray-900">
        <span className="text-gray-400 line-through">₹{mrp}</span>
        <span>₹{selling_price}</span>
      </div>

      {/* Bank Offer */}
      <p className="mt-1 text-sm">
        <span className="font-medium text-gray-900">₹62,900</span>{" "}
        <span className="text-orange-500">with Bank offer</span>
      </p>
    </div>
  );
};

export default ProductCard;
