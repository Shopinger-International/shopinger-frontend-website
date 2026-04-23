import Image from "next/image";

// types
import type IReview from "@/types/review";
import type { FC } from "react";
import type { IActionType } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// local components
import Rating from "@/components/common/rating.component";
import Avatar from "@/components/common/avatar.component";

// helpers
import { timeAgo } from "@/helpers/common.helper";

// api hooks
import useReactToReviewMutation from "@/hooks/axios/review/use-react-to-review-mutation.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// icons
import { ThumbsUp } from "lucide-react";

type IProps = IReview & {
  handleLoginModalState: ({
    open,
    action_type,
    onSuccess,
  }: {
    open: boolean;
    action_type?: IActionType;
    onSuccess?: () => void;
  }) => void;
};

const ProductReview: FC<IProps> = ({
  id,
  title,
  comment,
  rating,
  user,
  review_medias,
  variant_snapshot,
  created_at,
  handleLoginModalState,
}) => {
  const react_to_review_mutation = useReactToReviewMutation();
  const { data: user_details } = useUserDetails();
  const is_logged_in = !!user_details;
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
            <div
              className="relative size-20 overflow-hidden rounded-md border border-gray-300"
              key={`review-media-${media.id}`}
            >
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
      <div className="flex items-center gap-3 text-sm font-medium">
        <button
          className="flex cursor-pointer items-center gap-1 text-orange-500"
          onClick={() => {
            if (is_logged_in) {
              react_to_review_mutation.mutate({
                review_id: id,
              });
              return;
            }

            handleLoginModalState({
              open: true,
              action_type: "review_upvote",
              onSuccess: () => {
                react_to_review_mutation.mutate({
                  review_id: id,
                });
              },
            });
          }}
        >
          <ThumbsUp className="size-4" strokeWidth={2.5} />
          <span>Helpful</span>
        </button>
        <span> | </span>
        <button className="flex cursor-pointer items-center gap-1">
          Report
        </button>
      </div>
    </div>
  );
};
export default ProductReview;
