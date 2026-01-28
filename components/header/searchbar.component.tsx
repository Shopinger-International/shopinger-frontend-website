import Image from "next/image";
import { useState, useEffect, Fragment } from "react";
// types
import type { FC } from "react";
import type { IProduct } from "@/types/product";

// external components
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";

// icons
import { Triangle, Search } from "lucide-react";

// helpers
import clsx from "clsx";

// lib
import Axios from "@/lib/axios";

// react query
import { useQuery, useMutation } from "@tanstack/react-query";

// hooks
import useCategories from "@/hooks/use-categories";

const Searchbar: FC = () => {
  const [search_value, setSearchValue] = useState("");
  const [debounced_search_value, setDebouncedSearchValue] = useState("");
  const [selected_category, setSelectedCategory] = useState("All");
  const { data: categories = [] } = useCategories();

  const { data: search_product_list = [] } = useQuery<IProduct[], Error>({
    queryKey: ["search-product-list", debounced_search_value],
    async queryFn() {
      const { data } = await Axios.get<{ products: IProduct[] }>(
        `/search?q=${debounced_search_value}`,
      );
      return data.products;
    },
    enabled: !!debounced_search_value,
  });

  useEffect(() => {
    const timeout_id = setTimeout(() => {
      setDebouncedSearchValue(search_value);
    }, 500);
    return () => {
      timeout_id && clearTimeout(timeout_id);
    };
  }, [search_value]);
  return (
    <div
      className={clsx(
        "flex w-full items-stretch rounded-lg border border-orange-500 bg-white",
      )}
    >
      {/* Category Dropdown */}
      <Menu as="div" className="relative">
        <MenuButton
          className={clsx(
            "text-text-primary flex items-center gap-2 rounded-l-lg border border-orange-500 px-3 py-1.5 focus:outline-none",
            selected_category == "All" ? "font-semibold" : "font-medium",
          )}
        >
          {selected_category}
          <Triangle className="fill-text-primary size-3 rotate-180" />
        </MenuButton>

        <MenuItems className="ring-opacity-5 absolute left-0 z-50 mt-1 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-orange-500 focus:outline-none">
          <div className="sticky top-0 border-b border-orange-500 bg-white px-4 py-3.5 font-semibold">
            All Category
          </div>
          <div className="max-h-64 w-full space-y-0.5 overflow-y-auto p-1">
            {categories.map(({ name, slug }) => (
              <MenuItem key={slug}>
                {({ focus }) => (
                  <button
                    onClick={() => setSelectedCategory(name)}
                    className={clsx(
                      "w-full rounded-md px-4 py-2 text-left whitespace-nowrap",
                      focus && "bg-orange-100 text-orange-700",
                      selected_category == name &&
                        "bg-orange-500 font-medium text-white",
                    )}
                  >
                    {name}
                  </button>
                )}
              </MenuItem>
            ))}
          </div>
        </MenuItems>
      </Menu>

      <Combobox value={""} onChange={() => {}}>
        <div className="relative flex-1">
          {/* Input */}
          <ComboboxInput
            className="h-full w-full px-4 text-gray-700 placeholder-black/65 outline-none"
            placeholder="Search Mobile"
            aria-label="Search products, stores and collections"
            autoComplete="off"
            // displayValue={(product: Product) => product?.name ?? ""}
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
          />

          {/* Button */}
          <ComboboxButton className="absolute inset-y-0 right-0 -mr-px flex items-center rounded-r-lg bg-orange-500 px-3">
            <Search className="size-6 text-white" strokeWidth={1.5} />
          </ComboboxButton>
          {/* OPTIONS WITH TRANSITION */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="opacity-0 translate-y-1 scale-95"
            enterTo="opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100 translate-y-0 scale-100"
            leaveTo="opacity-0 translate-y-1 scale-95"
          >
            <ComboboxOptions className="absolute top-full right-0 left-0 z-50 mt-1 max-h-80 overflow-y-auto rounded-md border border-orange-500 bg-white shadow">
              {search_product_list.length === 0 ? (
                <div className="px-3 py-2 text-gray-500">No products found</div>
              ) : (
                search_product_list.map((product) => (
                  <ComboboxOption
                    key={product.id}
                    value={product}
                    as={Fragment}
                  >
                    {({ active, selected }) => (
                      <li
                        className={clsx(
                          "cursor-pointer px-3 py-2",
                          active && "text-orange-500",
                          selected && "font-semibold",
                        )}
                      >
                        <div className="flex items-center gap-4">
                          {product.thumbnail ? (
                            <Image
                              width={40}
                              height={40}
                              alt="product-image"
                              src={product.thumbnail}
                              className="rounded-lg border border-gray-300"
                            />
                          ) : (
                            <Search
                              className="size-6 text-orange-500"
                              strokeWidth={1.5}
                            />
                          )}
                          <span>{product.title}</span>
                        </div>
                      </li>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>

        {/* Options */}
      </Combobox>
    </div>
  );
};

export default Searchbar;
