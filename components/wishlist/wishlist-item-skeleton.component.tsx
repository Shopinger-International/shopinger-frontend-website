import type { FC } from "react";

const WishlistItemSkeleton: FC = () => {
  return (
    <article className="animate-pulse rounded-xl border border-gray-300 bg-white p-3 sm:flex sm:gap-4 sm:p-4">
      {/* Top */}
      <div className="flex flex-1 gap-3">
        {/* Image */}
        <div className="size-18 shrink-0 rounded-lg bg-gray-200 sm:size-28 sm:rounded-xl" />

        {/* Details */}
        <div className="min-w-0 flex-1">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
          </div>

          {/* Price */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="h-6 w-20 rounded bg-gray-200" />
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-6 w-16 rounded-md bg-orange-100" />
          </div>

          {/* Savings */}
          <div className="mt-2 h-3 w-28 rounded bg-gray-200" />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex shrink-0 items-center gap-2 border-t border-gray-100 pt-4 sm:mt-auto sm:ml-auto sm:border-0 sm:pt-0">
        <div className="size-11 rounded-md bg-gray-200" />
        <div className="h-11 flex-1 rounded-md bg-orange-100 sm:w-36 sm:flex-none" />
      </div>
    </article>
  );
};

export default WishlistItemSkeleton;
