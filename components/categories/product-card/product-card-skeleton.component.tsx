import type { FC } from "react";

const ProductCardSkeleton: FC = () => {
  return (
    <div className="group relative flex h-full w-full flex-col justify-between rounded-2xl p-2 sm:p-2.5 bg-white border border-gray-100 animate-pulse">
      <div className="flex flex-1 flex-col justify-between">
        <div className="relative aspect-square w-full rounded-xl bg-gray-100" />
        <div className="mt-2 space-y-1">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-3/4 rounded bg-gray-200" />
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-1 pt-2">
        <div className="h-4 w-12 rounded bg-gray-200" />
        <div className="h-7 w-20 rounded-lg bg-gray-200 sm:rounded-xl" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
