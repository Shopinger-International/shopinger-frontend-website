import type { FC } from "react";

// local components
import Rating from "@/components/common/rating.component";

type Review = {
  id: number;
  rating: number;
  title: string;
  text: string;
  is_verified: boolean;
  variant?: {
    color?: string;
    storage?: string;
  };
  images?: string[];
};
const ProductReview: FC<{ review: Review }> = ({ review }) => {
  const user = {
    name: "Ashish Prajapati",
    avatar: "https://i.pravatar.cc/150?img=12",
  };

  return (
    <div className="space-y-3 border-b border-gray-200 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <img
            src={user.avatar}
            className="h-8 w-8 rounded-full object-cover"
            alt={user.name}
          />

          {/* User info */}
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {user.name}
              </span>

              {review.is_verified && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] text-green-700">
                  Verified
                </span>
              )}
            </div>

            <div className="text-xs text-gray-500">2 days ago</div>
          </div>
        </div>

        <Rating
          totalStars={5}
          custom_rating={review.rating}
          onChange={() => {}}
          size={16}
        />
      </div>

      {/* Title */}
      <h4 className="font-semibold text-gray-900">{review.title}</h4>

      {/* Variant */}
      {review.variant && (
        <div className="text-xs text-gray-500">
          {review.variant.color && `Color: ${review.variant.color}`}
          {review.variant.color && review.variant.storage && " • "}
          {review.variant.storage && `Storage: ${review.variant.storage}`}
        </div>
      )}

      {/* Text */}
      <p className="text-sm leading-relaxed text-gray-600">{review.text}</p>

      {/* Images */}
      {review.images?.length ? (
        <div className="flex items-center gap-4">
          {review.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className="size-20 rounded-md object-cover"
              alt=""
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default ProductReview;
