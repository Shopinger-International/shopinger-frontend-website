import { useQuery } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

type IPriceFilter = {
  label: string;
  min: number;
  max: number;
};
type IRatingFilter = {
  label: string;
  min_rating: number;
  count: number;
};

export type IResponse = {
  message: string;
  price_filters: IPriceFilter[];
  rating_filters: IRatingFilter[];
};
const useCategorySortingFilters = ({
  category_slug,
  category_type,
}: {
  category_slug: string;
  category_type: string;
}) => {
  return useQuery({
    queryKey: ["category-filters", category_slug, category_type],
    async queryFn() {
      const { data } = await Axios.get<IResponse>(
        `/get-category-filters-meta?slug=${category_slug}&category_type=${category_type}`,
      );
      return data;
    },
  });
};
export default useCategorySortingFilters;
