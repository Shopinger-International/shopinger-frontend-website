import Image from "next/image";
import type IReview from "@/types/review";
import type { FC } from "react";

// local components
import Rating from "@/components/common/rating.component";
import Avatar from "@/components/common/avatar.component";

// helpers
import { timeAgo } from "@/helpers/common.helper";

const ProductReview: FC<IReview> = ({
  title,
  comment,
  rating,
  user,
  review_medias,
  variant_snapshot,
  created_at,
}) => {
  const product_review_medias = review_medias.map(({ media }) => media);
  const attributes_snapshot = variant_snapshot.attributes;
  return (
    <div className="space-y-3 border-b border-gray-200 py-4">
      <div className="flex items-center gap-3">
        <Avatar name={user.name} size={36} />

        {/* User info */}
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">
              {user.name}
            </span>
          </div>
          <div className="text-xs text-gray-600">{timeAgo(created_at)}</div>
        </div>
      </div>
      <div className="space-y-2">
        <Rating
          totalStars={5}
          custom_rating={rating}
          onChange={() => {}}
          size={16}
        />
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
          {!!Object.entries(attributes_snapshot).length && (
            <div className="text-xs text-gray-500">
              {Object.entries(attributes_snapshot)
                .map(([key, value]) => `${key} : ${value}`)
                .join(" | ")}
            </div>
          )}
        </div>
        <p className="text-sm leading-relaxed text-gray-600">{comment}</p>
      </div>

      {/* Images */}
      {!!product_review_medias.length ? (
        <div className="flex items-center gap-4">
          {product_review_medias.map((media, index) => (
            <div className="relative size-20 overflow-hidden rounded-md border border-gray-300">
              <Image
                key={index}
                fill={true}
                src={media.url}
                className="object-cover"
                alt="review-media"
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};
export default ProductReview;
