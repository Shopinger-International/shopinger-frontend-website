import { useQuery } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

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
      return data.data.map((filter) => {
        const { options } = filter;
        return {
          attribute: {
            ...filter.attribute,
            is_open: false,
          },
          options: options.map((option) => ({
            ...option,
            is_enabled: false,
          })),
        };
      });
    },
  });
};
export default useCategorySpecificFilters;
