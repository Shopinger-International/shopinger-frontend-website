import type { FC } from "react";

const SideFiltersSkeleton: FC = () => {
  return (
    <aside className="min-h-screen w-70 border border-gray-300 bg-white lg:rounded-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-xl bg-gray-200" />

          <div className="space-y-1">
            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
            <div className="h-2.5 w-24 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
      </div>

      <div className="px-4 pt-4">
        {/* Selected Filters Chips */}
        <div className="flex flex-wrap gap-1 pb-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-6 w-20 animate-pulse rounded-full bg-gray-200"
            />
          ))}
        </div>

        {/* Filter Sections */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              {/* Section Title */}
              <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />

              {/* Options */}
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="h-4 w-full animate-pulse rounded bg-gray-200"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideFiltersSkeleton;
