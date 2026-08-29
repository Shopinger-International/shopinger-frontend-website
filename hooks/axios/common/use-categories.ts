// react query
import { useQuery } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

type IBaseCategory = {
  id: number;
  name: string;
  slug: string;
  media: string;
};

type ICategory = IBaseCategory & {
  sub_categories: IBaseCategory[];
};

export const getCategory = async (has_product: boolean) => {
  const { data } = await Axios.get<{
    result: Array<ICategory>;
    success: boolean;
  }>(`/get-all-category?has_product=${has_product}`);
  return data.result;
};

const useCategories = (has_product: boolean = false) => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories-list", has_product],
    async queryFn() {
      const categories = await getCategory(has_product);
      return categories;
    },
    staleTime: 15 * 60 * 1000,
    retry: 4,
  });
};

export default useCategories;
