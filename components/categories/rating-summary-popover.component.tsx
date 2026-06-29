import Link from "next/link";
import { useState, useEffect, ReactNode } from "react";
// types
import type { FC } from "react";

// external components
import Tooltip from "@/components/common/tooltip.component";

// local components
import Rating from "@/components/common/rating.component";

// icons
import { ChevronRight, Star } from "lucide-react";

// hooks
import useProductRatingSummary from "@/hooks/axios/common/use-product-rating-summary.hook";

const ExtendedButton: FC<{
  open: boolean;
  handleOnOpen: () => void;
  children: ReactNode;
}> = ({ open, handleOnOpen, children }) => {
  useEffect(() => {
    open && handleOnOpen();
  }, [open]);
  return <>{children}</>;
};

type IProps = {
  product_id: number;
  product_reviews_link: string;
  children: ReactNode;
};
const RatingSummaryPopover: FC<IProps> = ({
  product_id,
  product_reviews_link,
  children,
}) => {
  const [is_hovered, setIsHovered] = useState(false);
  const { data: rating_summary, isPending } = useProductRatingSummary({
    product_id,
    enabled: is_hovered,
  });

  const average_rating = rating_summary?.average_rating ?? 0;
  const total_reviews = rating_summary?.total_reviews ?? 0;
  const rating_breakdown = rating_summary?.rating_breakdown ?? {};

  return (
    <Tooltip
      placement={"bottom"}
      className="w-72 rounded-xl border border-gray-300 bg-white p-4 shadow-xl"
      offset_distance={12}
      content={() =>
        isPending ? (
          <div className="flex items-center justify-center py-8">
            <div className="size-6 animate-spin rounded-full border-2 border-orange-400 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* top summary */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    {average_rating}
                  </span>
                  <Rating
                    total_stars={5}
                    custom_rating={average_rating}
                    size={20}
                  />
                </div>

                <p className="text-sm text-gray-500">
                  Based on {total_reviews.toLocaleString()} reviews
                </p>
              </div>
            </div>

            {/* breakdown */}
            <div className="space-y-2">
              {Object.entries(rating_breakdown)
                .sort((a, b) => {
                  const a_rating = Number(a[0]);
                  const b_rating = Number(b[0]);
                  return b_rating - a_rating;
                })
                .map(([rating, count], index) => {
                  const percent =
                    total_reviews > 0 ? (count / total_reviews) * 100 : 0;
                  return (
                    <div
                      key={`rating-breakdown-${index}`}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="flex w-10 items-center gap-1 text-gray-700">
                        <span>{rating}</span>
                        <Star className="size-3 fill-orange-400 text-orange-400" />
                      </div>

                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-orange-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <span className="w-10 text-right text-gray-600">
                        {percent}%
                      </span>
                    </div>
                  );
                })}
            </div>
            <div className="border-t border-gray-300" />
            <div>
              <Link
                href={product_reviews_link}
                className="flex items-center justify-center gap-1 text-orange-500"
              >
                <span>See all reviews</span>
                <ChevronRight className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        )
      }
    >
      {({ open }) => (
        <ExtendedButton open={open} handleOnOpen={() => setIsHovered(true)}>
          {children}
        </ExtendedButton>
      )}
    </Tooltip>
  );
};

export default RatingSummaryPopover;
