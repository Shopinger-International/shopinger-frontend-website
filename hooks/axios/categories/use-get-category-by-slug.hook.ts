import { useQuery } from "@tanstack/react-query";
// lib
import webAxios from "@/lib/axios/web.lib";

// type
import type { ICategoryLevel } from "@/types/campaign";

type IResponse = {
  success: boolean;
  category: {
    id: number;
  };
};

const useGetCategoryBySlug = ({
  category_slug,
  category_type,
}: {
  category_slug: string;
  category_type: ICategoryLevel;
}) => {
  return useQuery<IResponse["category"]>({
    queryKey: ["category-by-slug", category_slug, category_type],
    async queryFn() {
      const { data } = await webAxios<IResponse>(
        `/get-category-by-slug/${category_slug}?category_type=${category_type}`,
      );
      return data.category;
    },
  });
};
export default useGetCategoryBySlug;
