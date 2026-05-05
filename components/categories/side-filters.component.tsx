import { useEffect, useState } from "react";

// types
import type { FC } from "react";
import type {
  IFilterAttribute,
  IOption,
} from "@/hooks/axios/categories/use-category-specific-filter.hook";

// icons
import { SlidersHorizontal } from "lucide-react";

// local components
import FilterSelector from "@/components/categories/filter-selector.component";

// icons
import { X } from "lucide-react";

// api hooks
import useCategorySpecificFilters from "@/hooks/axios/categories/use-category-specific-filter.hook";

const SideFilters: FC<{
  category_type: string;
  category_slug: string;
}> = ({ category_type, category_slug }) => {
  const { data: filters_data, isPending } = useCategorySpecificFilters({
    category_slug,
    category_type,
  });
  const [filters, setFilters] = useState<
    Array<
      IFilterAttribute & {
        options: Array<IOption>;
      }
    >
  >([]);
  const selected_filters =
    filters &&
    filters
      .flatMap(({ attribute, options }) =>
        options.map((option) => ({
          ...option,
          attribute_code: attribute.code,
        })),
      )
      .filter(({ is_enabled }) => is_enabled);

  useEffect(() => {
    if (isPending || !filters_data) return;
    setFilters(filters_data);
  }, [filters_data, isPending]);

  if (isPending || !filters_data) return null;
  return (
    <aside className="min-h-screen w-70 rounded-xl border border-gray-300 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-300 bg-orange-500 p-2 text-white">
            <SlidersHorizontal className="size-4" />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-orange-500">Filters</h2>

            <p className="text-xs text-gray-600">Refine your results</p>
          </div>
        </div>
        <button
          onClick={() => setFilters(filters_data)}
          className="cursor-pointer text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          Clear All
        </button>
      </div>

      <div className="p-4 py-5">
        {!!selected_filters.length && (
          <div className="flex flex-wrap gap-1 pb-4">
            {selected_filters.map(({ attribute_code, label, value }) => (
              <button
                key={value}
                className="flex cursor-pointer items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-3 py-0.5 text-[11px] font-medium text-gray-900 transition hover:border-gray-400"
                onClick={() => {
                  setFilters((prev) =>
                    prev.map((filter) => {
                      if (filter.attribute.code == attribute_code) {
                        return {
                          ...filter,
                          options: filter.options.map((option) =>
                            value == option.value
                              ? {
                                  ...option,
                                  is_enabled: false,
                                }
                              : option,
                          ),
                        };
                      }
                      return filter;
                    }),
                  );
                }}
              >
                {label}
                <X className="size-3 text-gray-600" />
              </button>
            ))}
          </div>
        )}

        <div>
          {filters.map(({ attribute, options }) => (
            <FilterSelector
              key={`filer-selector-${attribute.code}`}
              label={attribute.name}
              code={attribute.code}
              options={options}
              is_open={attribute.is_open}
              handleOpen={(attribute_code) => {
                setFilters((prev) => {
                  return prev.map((filter) => {
                    const { code, is_open } = filter.attribute;
                    if (code == attribute_code) {
                      return {
                        ...filter,
                        attribute: {
                          ...filter.attribute,
                          is_open: !is_open,
                        },
                      };
                    }
                    return filter;
                  });
                });
              }}
              handleOptionChange={(
                attribute_code: string,
                option_value: string,
                is_enabled: boolean,
              ) =>
                setFilters((prev) =>
                  prev.map((filter) => {
                    const { attribute, options } = filter;
                    const { code } = attribute;
                    if (code == attribute_code) {
                      return {
                        ...filter,
                        options: options.map((option) =>
                          option.value == option_value
                            ? {
                                ...option,
                                is_enabled,
                              }
                            : option,
                        ),
                      };
                    }
                    return filter;
                  }),
                )
              }
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

export default SideFilters;
