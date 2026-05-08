import Image from "next/image";
import { useRouter } from "next/router";
import { useState, Fragment } from "react";
// types
import type { FC } from "react";
import type { IAlgoliaProduct } from "@/types/product";

// local components
import CustomHighlight from "@/components/header/search-bar/custom-highlight.component";
import { Autocomplete } from "./auto-complete.component";

// external components
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/react";
import { Hits, useRefinementList } from "react-instantsearch";

// helpers
import clsx from "clsx";

// icons
import { Search, Triangle } from "lucide-react";

// hooks
import { useSearchBox } from "react-instantsearch";

const SearchBarContent: FC = () => {
  const router = useRouter();
  const [selected_category, setSelectedCategory] = useState("All");
  const { query, refine: refineQuery } = useSearchBox();
  const { items, refine: refineList } = useRefinementList({
    attribute: "category",
  });
  console.log("value of items", items);

  return (
    <div className="relative flex w-full items-stretch rounded-lg border border-orange-500 bg-white">
      {/* CATEGORY */}
      <Menu as="div" className="relative">
        <MenuButton
          className={clsx(
            "flex items-center gap-2 rounded-l-lg border-r border-orange-500 px-3 py-1.5",
          )}
        >
          {selected_category}
          <Triangle className="size-2.5 rotate-180 fill-black" />
        </MenuButton>

        <MenuItems className="absolute left-0 z-50 mt-1 w-48 rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="max-h-64 space-y-1 overflow-y-auto p-1">
            <MenuItem>
              {({ focus }) => (
                <button
                  onClick={() => {
                    items.forEach(
                      (item) => item.isRefined && refineList(item.value),
                    );
                    setSelectedCategory("All");
                  }}
                  className={clsx(
                    "w-full rounded-md px-4 py-2 text-left text-sm font-medium",
                    focus && "bg-orange-100",
                    selected_category === "All" && "bg-orange-500 text-white",
                  )}
                >
                  All
                </button>
              )}
            </MenuItem>

            {items.map((item) => (
              <MenuItem key={item.value}>
                {({ focus }) => (
                  <button
                    onClick={() => {
                      setSelectedCategory(item.label);
                      items.forEach(
                        (item) => item.isRefined && refineList(item.value),
                      );
                      refineList(item.value);
                    }}
                    className={clsx(
                      "flex w-full items-center justify-between rounded-sm p-2 px-3 text-left text-sm font-medium",
                      focus && "bg-orange-100",
                      item.isRefined && "bg-orange-500 text-white",
                    )}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs">{item.count}</span>
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      {/* SEARCH */}
      <Combobox
        value={null}
        onChange={(value) => {
          if (value) {
            router.push(`${value}`);
          }
        }}
      >
        <div className="flex-1">
          {/* INPUT */}
          {/* <ComboboxInput
            className="h-full w-full px-4 outline-none"
            placeholder="Search products..."
            autoComplete="off"
            value={query}
            onChange={(e) => refineQuery(e.target.value)}
          /> */}

          <Autocomplete
            className="h-full w-full px-4 outline-none"
            placeholder="Search Products..."
            detachedMediaQuery="none"
            openOnFocus
          />
          {/* BUTTON */}
          <ComboboxButton className="absolute inset-y-0 right-0 flex items-center rounded-r-lg bg-orange-500 px-3">
            <Search className="size-5 text-white" />
          </ComboboxButton>

          {/* DROPDOWN */}
          <Transition
            as={Fragment}
            enter="transition duration-150"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ComboboxOptions className="absolute top-full right-0 left-0 z-50 mt-1 max-h-120 w-full overflow-y-auto rounded-md border border-gray-300 bg-white shadow-lg">
              <Hits<IAlgoliaProduct>
                hitComponent={({ hit }) => (
                  <ComboboxOption
                    key={hit.objectID}
                    value={hit.url}
                    as={Fragment}
                  >
                    {({ active }) => (
                      <li
                        className={clsx(
                          "cursor-pointer px-3 py-3",
                          active && "bg-orange-50",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative size-14 shrink-0 rounded-sm border border-gray-300">
                            <Image
                              src={hit.image}
                              alt={hit.title}
                              className="size-12 rounded border object-cover"
                              fill={true}
                            />
                          </div>

                          <div>
                            <p className="line-clamp-1 text-sm font-medium">
                              <CustomHighlight attribute={"title"} hit={hit} />
                            </p>
                            <p className="w-full max-w-md truncate text-xs font-medium text-gray-900">
                              <CustomHighlight
                                attribute={"category"}
                                hit={hit}
                              />{" "}
                              &gt;{" "}
                              <CustomHighlight
                                attribute={"sub_category"}
                                hit={hit}
                              />{" "}
                              &gt;{" "}
                              <CustomHighlight
                                attribute={"sub_sub_category"}
                                hit={hit}
                              />
                            </p>
                            <p className="text-xs text-gray-600">
                              ₹<CustomHighlight attribute={"price"} hit={hit} />
                            </p>
                          </div>
                        </div>
                      </li>
                    )}
                  </ComboboxOption>
                )}
              />
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};
export default SearchBarContent;
