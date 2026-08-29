// react query
import { useQuery } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

export type IBaseCategory = {
  id: number;
  name: string;
  slug: string;
  media: string;
};

type ICategory = IBaseCategory & {
  sub_categories: Array<
    IBaseCategory & {
      sub_sub_categories: IBaseCategory[];
    }
  >;
};

type ILevel = "main" | "sub" | "subsub";

export const getCategory = async (has_product: boolean, level: ILevel) => {
  const { data } = await Axios.get<{
    result: Array<ICategory>;
    success: boolean;
  }>(`/get-all-category?has_product=${has_product}&level=${level}`);
  return data.result;
};

const useCategories = (has_product: boolean = false, level: ILevel = "sub") => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories-list", has_product, level],
    async queryFn() {
      const categories = await getCategory(has_product, level);
      return categories;
    },
    staleTime: 15 * 60 * 1000,
    retry: 4,
  });
};

export default useCategories;
