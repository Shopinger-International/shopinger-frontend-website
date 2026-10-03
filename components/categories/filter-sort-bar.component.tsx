import { useContext } from "react";
// types
import type { FC } from "react";

// icons
import { ArrowUpWideNarrowIcon, SlidersHorizontal } from "lucide-react";

// context
import { FiltersSortBarState } from "@/context";
import clsx from "clsx";

const FilterSortBar: FC<{
  disable_side_filter?: boolean;
  className?: string;
}> = ({ disable_side_filter = false, className }) => {
  const { state, updateState } = useContext(FiltersSortBarState);
  return (
    <div
      className={clsx(
        "flex h-11 items-center justify-center border-b border-gray-200 bg-white shadow-2xs lg:hidden",
        className,
      )}
    >
      <div className="flex w-full items-center px-2">
        <button
          type="button"
          onClick={() => updateState?.("sort")}
          className="flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium cursor-pointer"
        >
          <ArrowUpWideNarrowIcon className="size-4" />
          <span>Sort</span>
        </button>

        <div className="mx-2 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => updateState?.("filter")}
          className="flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium disabled:cursor-not-allowed disabled:text-gray-300 cursor-pointer"
          disabled={disable_side_filter}
        >
          <SlidersHorizontal className="size-4" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
};
export default FilterSortBar;
