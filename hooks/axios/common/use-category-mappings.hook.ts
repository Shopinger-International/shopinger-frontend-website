import { useQuery } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type ICategoryAttributeMapping from "@/types/category-attribute-mapping";

// lib
import webAxios from "@/lib/axios/web.lib";

// service
export const getMappings = async (
  category_id: number,
): Promise<ICategoryAttributeMapping[]> => {
  const { data } = await webAxios.get<{
    data: ICategoryAttributeMapping[];
  }>(`/list-category-attributes/${category_id}?type=subsub`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data.data;
};

type IResponse = ICategoryAttributeMapping[];

const useCategoryMappings = (category_id?: number) => {
  return useQuery<IResponse, AxiosError>({
    queryKey: ["category-mappings", category_id],

    queryFn: () => getMappings(category_id as number),

    enabled: !!category_id, // prevents unnecessary call

    staleTime: 1000 * 60 * 5, // 5 mins cache

    retry: 1, // don’t spam API
  });
};

export default useCategoryMappings;
