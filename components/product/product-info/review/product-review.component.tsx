// types
import type { FC } from "react";
import type IReview from "@/types/review";
import type { IReportModalState } from "@/pages/[product_slug]/p/[product_id]/reviews";

// local components
import Rating from "@/components/common/rating.component";
import Avatar from "@/components/common/avatar.component";

// helpers
import { formatDate } from "@/helpers/common.helper";
import clsx from "clsx";

// icons
import { ThumbsUp } from "lucide-react";

// hooks
import useReactToReviewMutation from "@/hooks/axios/review/use-react-to-review-mutation.hook";
import useDeleteReviewReactionMutation from "@/hooks/axios/review/use-delete-review-reaction-mutation.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

type IProps = IReview & {
  product_id: number;
  handleReportModalState: ({ open, review_id }: IReportModalState) => void;
};

const ProductReview: FC<IProps> = ({
  id,
  user,
  rating,
  title,
  comment,
  created_at,
  helpful_count,
  is_reacted,
  product_id,
  handleReportModalState,
}) => {
  const { data: user_details } = useUserDetails();
  const is_logged_in = !!user_details;
  const react_to_review_mutation = useReactToReviewMutation(
    product_id,
    "helpful",
  );
  const delete_review_reaction_mutation = useDeleteReviewReactionMutation(
    product_id,
    "helpful",
  );
  const { openModal: openLoginModal } = useLoginModalContext();
  return (
    <div className="space-y-2 rounded-xl border border-gray-300 bg-gray-50 p-6">
      <Rating total_stars={5} custom_rating={rating} size={16} />
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
              if (is_reacted) {
                delete_review_reaction_mutation.mutate({
                  review_id: id,
                });
                return;
              }
              if (is_logged_in) {
                react_to_review_mutation.mutate({
                  review_id: id,
                });
                return;
              }

              openLoginModal({
                onSuccess: () => {
                  react_to_review_mutation.mutate({
                    review_id: id,
                  });
                },
              });
            }}
          >
            <ThumbsUp
              className={clsx("size-4", is_reacted && "fill-orange-500")}
              strokeWidth={2.5}
            />
            <span>Helpful {helpful_count > 0 && `(${helpful_count})`}</span>
          </button>
          <span> | </span>
          <button
            className="flex cursor-pointer items-center gap-1"
            onClick={() => {
              handleReportModalState({
                open: true,
                review_id: id,
              });
            }}
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
