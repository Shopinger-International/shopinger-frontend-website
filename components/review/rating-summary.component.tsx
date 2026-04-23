import { FC } from "react";
import Rating from "@/components/common/rating.component";
import { Star } from "lucide-react";

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";

type IProps = {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: Record<number, number>;
};

const RatingSummary: FC<IProps> = ({
  average_rating,
  total_reviews,
  rating_breakdown,
}) => {
  const is_mobile = useIsMobile();
  return (
    <div className="flex flex-col gap-8 border-b border-gray-300 pb-6 md:flex-row md:items-center md:justify-between">
      {/* LEFT: Overall summary */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-end gap-2 sm:gap-3">
          <h1 className="text-3xl leading-none font-semibold sm:text-5xl">
            {average_rating.toFixed(1)}
          </h1>

          <div className="flex items-center pb-1">
            <Star className="size-6 fill-orange-500 text-orange-500 sm:size-10" />
          </div>
        </div>

        <div className="text-sm text-gray-600">
          Based on{" "}
          <span className="font-medium text-gray-900">
            {total_reviews.toLocaleString()}
          </span>{" "}
          ratings
        </div>

        <Rating
          totalStars={5}
          custom_rating={average_rating}
          size={is_mobile ? 14 : 20}
          onChange={() => {}}
        />
      </div>

      {/* RIGHT: Distribution */}
      <div className="w-full space-y-3 md:w-1/2">
        {Object.entries(rating_breakdown).map(([rating, count], index) => {
          const percent = total_reviews > 0 ? (count / total_reviews) * 100 : 0;

          return (
            <div
              key={`rating-break-down-${index}`}
              className="group flex items-center gap-3"
            >
              {/* Star label */}
              <div className="flex w-12 items-center gap-1 text-sm text-gray-700">
                <span className="font-medium">{rating}</span>
                <Star className="size-3.5 fill-orange-500 text-orange-500" />
              </div>

              {/* Bar */}
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-orange-500 transition-all duration-500 group-hover:bg-orange-600"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Percent instead of raw count (cleaner UX) */}
              <span className="w-14 text-right text-xs text-gray-500 tabular-nums">
                {percent.toFixed(0)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSummary;
