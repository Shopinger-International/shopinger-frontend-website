import { useEffect, useRef, useState } from "react";

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
import { ThumbsUp, ChevronDown } from "lucide-react";

// hooks
import useReactToReviewMutation from "@/hooks/axios/review/use-react-to-review-mutation.hook";
import useDeleteReviewReactionMutation from "@/hooks/axios/review/use-delete-review-reaction-mutation.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";

// api hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

type IProps = IReview & {
  product_id: number;
  handleReportModalState: ({
    open,
    review_id,
    source,
  }: IReportModalState) => void;
};

const ProductReview: FC<IProps> = ({
  id,
  user,
  rating,
  title,
  source,
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

  const comment_ref = useRef<HTMLParagraphElement>(null);

  const [is_expanded, setIsExpanded] = useState(false);
  const [is_truncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = comment_ref.current;

    if (!element || is_expanded) return;

    const checkOverflow = () => {
      setIsTruncated(element.scrollHeight > element.clientHeight);
    };

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [comment, is_expanded]);

  return (
    <div className="space-y-2 rounded-xl border border-gray-300 bg-gray-50 p-6">
      <Rating total_stars={5} custom_rating={rating} size={16} />

      <h4 className="text-sm font-medium text-gray-900">{title}</h4>

      <div className="relative">
        <p
          ref={comment_ref}
          className={clsx(
            "text-sm font-medium",
            !is_expanded && "line-clamp-4",
          )}
        >
          {comment}
        </p>

        {/* Fade-out Overlay */}
        {!is_expanded && is_truncated && (
          <div className="pointer-events-none absolute bottom-0 left-0 h-8 w-full bg-linear-to-t from-gray-50 to-transparent" />
        )}
      </div>

      {is_truncated && (
        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          className="flex cursor-pointer items-center gap-0.5 text-xs font-semibold text-orange-500 underline hover:text-orange-600"
        >
          <ChevronDown
            className={clsx(
              "size-4 stroke-3 transition-transform duration-200",
              is_expanded ? "rotate-180" : "rotate-0",
            )}
          />
          <span>{is_expanded ? "Read less" : "Read more"}</span>
        </button>
      )}

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar name={user.name} size={32} />

          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {user.name}
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
                  source,
                });
                return;
              }
              if (is_logged_in) {
                react_to_review_mutation.mutate({
                  review_id: id,
                  source,
                });
                return;
              }

              openLoginModal({
                is_modal: true,
                title: "Login to React",
                onSuccess: () => {
                  react_to_review_mutation.mutate({
                    review_id: id,
                    source,
                  });
                },
                onCancel() {},
              });
            }}
          >
            <ThumbsUp
              className={clsx("size-4", is_reacted && "fill-orange-500")}
              strokeWidth={2.5}
            />

            <span>Helpful {helpful_count > 0 && `(${helpful_count})`}</span>
          </button>

          <span>|</span>

          <button
            className="flex cursor-pointer items-center gap-1"
            onClick={() => {
              handleReportModalState({
                open: true,
                review_id: id,
                source,
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
