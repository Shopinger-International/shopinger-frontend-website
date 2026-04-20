// types
import type { FC } from "react";

// local components
import Rating from "@/components/common/rating.component";

// helpers
import { formatDate } from "@/helpers/common.helper";

// icons
import { ThumbsUp, ThumbsDown } from "lucide-react";

const ProductReview: FC<{
  id: string;
  user_name: string;
  rating: number;
  title: string;
  description: string;
  created_at: string;
}> = ({ id, user_name, rating, title, description, created_at }) => {
  return (
    <div className="space-y-2 rounded-xl border border-gray-300 bg-gray-50 p-6">
      <Rating
        totalStars={5}
        custom_rating={rating}
        onChange={() => {}}
        size={16}
      />
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="line-clamp-3 text-sm font-medium">{description}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8.5 w-8.5 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
            {user_name.charAt(0)}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user_name}{" "}
              <span className="hidden text-gray-600 sm:inline">
                (Ghaziabad, UP)
              </span>
            </span>
            <span className="text-xs font-medium text-gray-600">
              {formatDate(created_at)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2">
            <ThumbsUp className="size-4 text-gray-600" />
            <span>20</span>
          </button>
          <button className="flex items-center gap-2">
            <ThumbsDown className="size-4 text-gray-600" />
            <span>20</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
