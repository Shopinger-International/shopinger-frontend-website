// types
import type { FC } from "react";

// external components
import Tooltip from "@/components/common/tooltip.component";

// icons
import { ChevronDown, Star } from "lucide-react";

const ratingBreakdown = [
  { star: 5, percentage: 72 },
  { star: 4, percentage: 18 },
  { star: 3, percentage: 6 },
  { star: 2, percentage: 3 },
  { star: 1, percentage: 1 },
];

const RatingPopover: FC = () => {
  const averageRating = 4.6;
  const totalReviews = 1248;

  return (
    <Tooltip
      placement={"bottom"}
      className="w-72 rounded-xl border border-gray-300 bg-white p-4 shadow-xl"
      offset_distance={12}
      content={() => (
        <div className="space-y-4">
          {/* top summary */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {averageRating}
                </span>

                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-4 fill-orange-400 text-orange-400"
                    />
                  ))}
                </div>
              </div>

              <p className="text-sm text-gray-500">
                Based on {totalReviews.toLocaleString()} reviews
              </p>
            </div>
          </div>

          {/* breakdown */}
          <div className="space-y-2">
            {ratingBreakdown.map((item) => (
              <div key={item.star} className="flex items-center gap-3 text-sm">
                <div className="flex w-10 items-center gap-1 text-gray-700">
                  <span>{item.star}</span>
                  <Star className="size-3 fill-orange-400 text-orange-400" />
                </div>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-orange-400"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>

                <span className="w-10 text-right text-gray-600">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    >
      {() => (
        <button className="text-orange-500">
          <ChevronDown className="size-5" strokeWidth={2.5} />
        </button>
      )}
    </Tooltip>
  );
};

export default RatingPopover;
