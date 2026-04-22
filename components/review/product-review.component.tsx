import type IReview from "@/types/review";
import type { FC } from "react";

// local components
import Rating from "@/components/common/rating.component";
import Avatar from "@/components/common/avatar.component";

const ProductReview: FC<IReview> = ({
  title,
  comment,
  rating,
  user,
  is_verified_purchase,
  review_medias,
  variant_snapshot,
}) => {
  const product_review_medias = review_medias.map(({ media }) => media);
  const attributes_snapshot = variant_snapshot.attributes;
  return (
    <div className="space-y-3 border-b border-gray-200 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <Avatar name={user.name} />

          {/* User info */}
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">
                {user.name}
              </span>

              {is_verified_purchase && (
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
          custom_rating={rating}
          onChange={() => {}}
          size={16}
        />
      </div>

      {/* Title */}
      <h4 className="font-semibold text-gray-900">{title}</h4>

      {/* Variant */}
      {!!Object.entries(attributes_snapshot).length && (
        <div className="text-xs text-gray-500">
          {Object.entries(attributes_snapshot)
            .map(([key, value]) => `${key} : ${value}`)
            .join(", ")}
        </div>
      )}

      {/* Text */}
      <p className="text-sm leading-relaxed text-gray-600">{comment}</p>

      {/* Images */}
      {!!product_review_medias.length ? (
        <div className="flex items-center gap-4">
          {product_review_medias.map((media, index) => (
            <img
              key={index}
              src={media.url}
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
