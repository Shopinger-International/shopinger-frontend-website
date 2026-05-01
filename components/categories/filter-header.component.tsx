import { useState } from "react";

// icons
import { ChevronDown, Check, Star } from "lucide-react";

// helpers
import clsx from "clsx";

import { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  Transition,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

const sort_options = [
  { label: "Newest", value: "latest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
];

const rating_options = [4, 3, 2, 1];

const price_ranges = [
  { label: "Under ₹500", value: "0-500" },
  { label: "₹500 - ₹1000", value: "500-1000" },
  { label: "₹1000 - ₹5000", value: "1000-5000" },
  { label: "Above ₹5000", value: "5000-max" },
];

type IFilters = {
  sort: string;
  price: string | null;
  rating: number | null;
};
const FilterHeader = () => {
  const [filters, setFilters] = useState<IFilters>({
    sort: "latest",
    price: null,
    rating: null,
  });
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* Left */}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Sort */}
        <div className="relative">
          <SelectInput />
        </div>

        {/* Price */}
        <div className="flex flex-wrap gap-2">
          {price_ranges.map((price) => {
            const active = price.value == filters.price;

            return (
              <button
                key={price.value}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    price: price.value,
                  }))
                }
                className={clsx(
                  "flex h-9 items-center gap-1 rounded-lg border px-3 text-sm",
                  active
                    ? "bg-orange-500 font-semibold text-white"
                    : "border-gray-300 bg-white font-medium text-gray-900",
                )}
              >
                {active && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
                {price.label}
              </button>
            );
          })}
        </div>

        {/* Rating */}
        <div className="flex flex-wrap gap-2">
          {rating_options.map((rating) => {
            const active = rating == filters.rating;

            return (
              <button
                key={rating}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    rating,
                  }))
                }
                className={clsx(
                  "flex h-9 items-center gap-1 rounded-lg border px-3 text-sm",
                  active
                    ? "bg-orange-500 font-semibold text-white"
                    : "border-gray-300 bg-white font-medium text-gray-900",
                )}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    active ? "fill-white" : "fill-orange-400 text-orange-400"
                  }`}
                />
                {rating}+
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterHeader;

const SelectInput = () => {
  const [selected_sort, setSelectedSort] = useState(null);
  return (
    <Listbox value={selected_sort} onChange={setSelectedSort}>
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
              "absolute right-0 z-20 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-300 bg-white p-1 shadow-md outline-none",
            )}
          >
            {sort_options.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                className={({ active }) =>
                  clsx(
                    "relative flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm transition select-none",
                    active ? "bg-orange-500 text-white" : "text-gray-900",
                  )
                }
              >
                {({ selected }) => (
                  <>
                    <span
                      className={clsx(
                        "truncate",
                        selected && "font-medium text-gray-900",
                      )}
                    >
                      {option.label}
                    </span>

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
