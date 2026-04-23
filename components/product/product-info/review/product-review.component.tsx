// types
import type { FC } from "react";
import type IReview from "@/types/review";
import type { IActionType } from "@/pages/[product_slug]/p/[product_id]/[variant_id]";

// local components
import Rating from "@/components/common/rating.component";
import Avatar from "@/components/common/avatar.component";

// helpers
import { formatDate } from "@/helpers/common.helper";

// icons
import { ThumbsUp } from "lucide-react";

// hooks
import useReactToReviewMutation from "@/hooks/axios/review/use-react-to-review-mutation.hook";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

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
  user,
  rating,
  title,
  comment,
  created_at,
  handleLoginModalState,
}) => {
  const { data: user_details } = useUserDetails();
  const is_logged_in = !!user_details;
  const react_to_review_mutation = useReactToReviewMutation();
  return (
    <div className="space-y-2 rounded-xl border border-gray-300 bg-gray-50 p-6">
      <Rating
        totalStars={5}
        custom_rating={rating}
        onChange={() => {}}
        size={16}
      />
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <p className="line-clamp-3 text-sm font-medium">{comment}</p>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={user.name} size={32} />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user.name}{" "}
              <span className="hidden text-gray-600 sm:inline">
                (Ghaziabad, UP)
              </span>
            </span>
            <span className="text-xs font-medium text-gray-600">
              {formatDate(created_at)}
            </span>
          </div>
        </div>
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
    </div>
  );
};

export default ProductReview;
