// react query
import { useQuery } from "@tanstack/react-query";

// types
import type { ICategory } from "@/types/categories";

// lib
import Axios from "@/lib/axios/private.lib";

const useCategories = () => {
  return useQuery<ICategory[], Error>({
    queryKey: ["categories-list"],
    async queryFn() {
      const { data } = await Axios.get<{
        message: string;
        categories: Array<ICategory>;
        success: boolean;
      }>("/get-all-category");
      return data.categories;
    },
  });
};

export default useCategories;
