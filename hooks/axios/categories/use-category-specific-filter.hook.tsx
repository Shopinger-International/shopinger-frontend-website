import { useQuery } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { capitalizeValue } from "@/helpers/common.helper";

export type IOption = {
  label: string;
  value: string;
  is_enabled: boolean;
};

export type IFilterAttribute = {
  attribute: {
    name: string;
    code: string;
    is_open: boolean;
  };
};

export type IResponse = {
  message: string;
  brands: Array<string>;
  data: Array<
    IFilterAttribute & {
      options: Array<Omit<IOption, "is_enabled">>;
    }
  >;
};
const useCategorySpecificFilters = ({
  category_slug,
  category_type,
}: {
  category_slug: string;
  category_type: string;
}) => {
  return useQuery<
    IResponse,
    Error,
    Array<
      IFilterAttribute & {
        options: Array<IOption>;
      }
    >
  >({
    queryKey: ["category-specific-filters", category_slug, category_type],
    async queryFn() {
      const { data } = await Axios.get<IResponse>(
        `/list-category-filterable-attributes?slug=${category_slug}&type=${category_type}`,
      );
      return data;
    },
    select(data) {
      let count = 0;
      return [
        {
          attribute: {
            name: "Brand",
            code: "brand",
            is_open: !!data.brands.length,
          },
          options: data.brands.map((brand) => ({
            label: capitalizeValue(brand),
            value: brand,
            is_enabled: false,
          })),
        },
        ...data.data.map((filter) => {
          const { options } = filter;
          return {
            attribute: {
              ...filter.attribute,
              is_open: count++ < 2 && !!options.length,
            },
            options: options.map((option) => ({
              ...option,
              is_enabled: false,
            })),
          };
        }),
      ];
    },
  });
};
export default useCategorySpecificFilters;
