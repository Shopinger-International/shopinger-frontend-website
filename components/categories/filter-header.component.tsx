import { Fragment } from "react";

// types
import type { FC } from "react";
import type { IResponse } from "@/hooks/axios/categories/use-category-filters.hook";
import type { ISelectedFilters } from "./category-products.component";
import type { ISort } from "@/components/categories/category-products.component";

// icons
import { ChevronDown, Check, Star } from "lucide-react";

// helpers
import clsx from "clsx";

// external components
import {
  Listbox,
  ListboxButton,
  Transition,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

const sort_options = [
  { label: "Newest", value: "latest" },
  { label: "Price: Low to High", value: "price_low_high" },
  { label: "Price: High to Low", value: "price_high_low" },
  { label: "Top Rated", value: "top_rated" },
];

type IProps = IResponse & {
  selected_filters: ISelectedFilters | null;
  onChange: (selected_filter: ISelectedFilters | null) => void;
};

const FilterHeader: FC<IProps> = ({
  selected_filters,
  price_filters,
  rating_filters,
  onChange,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <div className="relative">
          <SelectInput
            selected_sort={selected_filters?.sort}
            onChange={(selected_sort) =>
              onChange({
                ...selected_filters,
                sort: selected_sort,
              })
            }
          />
        </div>

        {/* Price */}
        <div className="flex flex-wrap gap-2">
          {price_filters.map(({ label, min, max }) => {
            const active =
              selected_filters?.min_price == min &&
              selected_filters?.max_price == max;

            return (
              <button
                key={label}
                onClick={() =>
                  onChange({
                    ...selected_filters,
                    min_price: min,
                    max_price: max,
                  })
                }
                className={clsx(
                  "flex h-9 items-center gap-1 rounded-lg border px-3 text-sm",
                  active
                    ? "bg-orange-500 font-semibold text-white"
                    : "border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-100",
                )}
              >
                {active && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                {label}
              </button>
            );
          })}
        </div>

        {/* Rating */}
        <div className="flex flex-wrap gap-2">
          {rating_filters.map(({ label, count, min_rating }) => {
            const active = min_rating == selected_filters?.min_rating;

            if (!count) return null;
            return (
              <button
                key={label}
                onClick={() =>
                  onChange({
                    ...selected_filters,
                    min_rating: min_rating,
                  })
                }
                className={clsx(
                  "flex h-9 items-center gap-1 rounded-lg border px-3 text-sm",
                  active
                    ? "bg-orange-500 font-semibold text-white"
                    : "border-gray-300 bg-white font-medium text-gray-900 hover:bg-gray-100",
                )}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    active ? "fill-white" : "fill-orange-400 text-orange-400"
                  }`}
                />
                {label}
              </button>
            );
          })}
        </div>
        <button
          className="flex h-9 items-center gap-1 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-900 hover:bg-gray-100"
          onClick={() => onChange(null)}
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

export default FilterHeader;

const SelectInput: FC<{
  selected_sort?: ISort;
  onChange: (selected_sort: ISort) => void;
}> = ({ selected_sort, onChange }) => {
  return (
    <Listbox value={selected_sort} onChange={onChange}>
      <div className="relative">
        {/* Button */}
        <ListboxButton
          className={clsx(
            "relative h-9 min-w-47.5 cursor-pointer rounded-lg border border-gray-300 bg-white pr-9 pl-3 text-left text-sm font-medium outline-none",
          )}
        >
          <span className="block truncate">
            {sort_options.find((option) => option.value === selected_sort)
              ?.label ?? "Please Select"}
          </span>

          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <ChevronDown size={16} className="text-gray-600" />
          </span>
        </ListboxButton>

        {/* Dropdown */}
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <ListboxOptions
            className={clsx(
              "absolute right-0 z-20 mt-2 max-h-60 w-full space-y-1 overflow-auto rounded-xl border border-gray-300 bg-white p-1 shadow-md outline-none",
            )}
          >
            {sort_options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ focus, selected }) =>
                  clsx(
                    "relative flex cursor-pointer items-center rounded-md px-3 py-2 text-sm transition select-none",
                    focus && "bg-orange-100 text-gray-900",
                    selected && "bg-orange-500 font-medium text-white",
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span className={clsx("truncate")}>{option.label}</span>

                    {selected && (
                      <span className="ml-auto">
                        <Check size={16} />
                      </span>
                    )}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
};
