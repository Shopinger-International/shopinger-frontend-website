import type { FC } from "react";

const SortFilterHeaderSkeleton: FC = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort Dropdown Skeleton */}
        <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200" />

        {/* Price Filters Skeleton */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>

        {/* Rating Filters Skeleton */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>

        {/* Clear Button Skeleton */}
        <div className="h-9 w-24 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
};

export default SortFilterHeaderSkeleton;
