import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import { IProductReviewsPageType } from "@/hooks/axios/review/use-get-my-reviews.hook";

// icons
import { Calendar, Pencil, ThumbsUp, Trash2 } from "lucide-react";

// local components
import Rating from "@/components/common/rating.component";

// helpers
import { format } from "date-fns";
import { generateSlug } from "@/helpers/product.helper";

// hooks
import useDeleteReviewMutation from "@/hooks/axios/review/use-delete-review.hook";

const UserReview: FC<
  IProductReviewsPageType["reviews"][0] & {
    onEditHandler: () => void;
  }
> = ({ onEditHandler, ...review }) => {
  const delete_review_mutation = useDeleteReviewMutation();
  return (
    <div className="rounded-xl border border-gray-300 bg-white px-6 pt-6 pb-4">
      <div className="mb-4 flex items-center gap-4 border-b border-gray-300 pb-4">
        <Link
          href={`${generateSlug(review.title)}/p/${review.product_id}/${review.variant_id}`}
        >
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-300">
            <Image
              src={review.product_media_url}
              alt={review.product_title}
              fill
              className="object-cover"
            />
          </div>
        </Link>

        <div className="min-w-0">
          <h2 className="truncate font-medium text-gray-900">
            {review.product_title}
          </h2>
        </div>
      </div>
      {/* header */}
      <div className="flex flex-col">
        <h3 className="font-semibold text-gray-900">{review.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Rating total_stars={5} size={16} custom_rating={review.rating} />
            <span>{review.rating.toFixed(1)}</span>
          </div>

          <span className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            <Calendar size={15} />
            <span>{format(new Date(review.created_at), "MMMM d, yyyy")}</span>
          </div>
        </div>
      </div>
      <p className="mt-4 max-w-3xl leading-7 text-gray-600">{review.comment}</p>
      {review.review_medias.length > 0 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {review.review_medias.map(({ media }) => (
            <button
              key={media.id}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-200"
            >
              <Image
                src={media.url}
                alt="review image"
                fill={true}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-gray-300 pt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ThumbsUp size={16} />
          <span>{review.helpful_count} Helpful</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onEditHandler}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            disabled={delete_review_mutation.isPending}
            onClick={() =>
              delete_review_mutation.mutate({
                review_id: review.id,
              })
            }
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:text-red-300"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
