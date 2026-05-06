import type { FC } from "react";

const ProductCardSkeleton: FC = () => {
  return (
    <div className="block overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* image */}
      <div className="relative aspect-3/2 overflow-hidden bg-gray-200">
        <div className={`h-full w-full bg-gray-200`} />

        {/* top badges */}
        <div className="absolute flex w-full items-center justify-between p-2">
          <div className="h-5 w-12 rounded-full bg-gray-300" />
          <div className="h-8 w-8 rounded-full bg-gray-300" />
        </div>

        {/* NEW tag */}
        <div className="absolute right-0 bottom-2 h-5 w-12 rounded bg-gray-300" />
      </div>

      {/* content */}
      <div className="space-y-2 p-4">
        {/* title */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-4 w-1/2 rounded bg-gray-200" />
        </div>

        {/* rating */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-24 rounded bg-gray-200" />
        </div>

        {/* price */}
        <div className="flex items-center gap-2">
          <div className="h-5 w-20 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
