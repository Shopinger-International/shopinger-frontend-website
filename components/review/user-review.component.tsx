import Image from "next/image";
// types
import type { FC } from "react";
import type IMedia from "@/types/media";

// icons
import { Calendar, Pencil, ThumbsUp, Trash2 } from "lucide-react";

// local components
import Rating from "@/components/common/rating.component";

// helpers
import { format } from "date-fns";

type IProps = {
  title: string;
  comment: string;
  rating: number;
  created_at: string;
  medias: IMedia[];
  helpful_count:number;
};
const UserReview: FC<IProps> = ({
  title,
  comment,
  rating,
  created_at,
  medias,
  helpful_count
}) => {
  return (
    <div className="rounded-xl border border-gray-300 bg-white px-6 pt-6 pb-4">
      {/* header */}
      <div className="flex flex-col">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Rating total_stars={5} size={16} custom_rating={rating} />
            <span>{rating.toFixed(1)}</span>
          </div>

          <span className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-1">
            <Calendar size={15} />
            <span>{format(new Date(created_at), "MMMM d, yyyy")}</span>
          </div>
        </div>
      </div>
      <p className="mt-4 max-w-3xl leading-7 text-gray-600">{comment}</p>
      {medias.length > 0 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {medias.map((media) => (
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
          <span>{helpful_count} Helpful</span>
        </div>

        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            <Pencil size={16} />
            Edit
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50">
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserReview;
