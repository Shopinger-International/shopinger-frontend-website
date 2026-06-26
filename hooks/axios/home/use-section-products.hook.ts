import { useInfiniteQuery } from "@tanstack/react-query";
import Axios from "@/lib/axios/private.lib";

// types
import type IProduct from "@/types/product";

type IGetProductsBySectionParams = {
  section: string;
  limit?: number;
};

type IResponseType = {
  message: string;
  pagination: {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
  products: Array<
    IProduct & {
      avg_rating: number;
    }
  >;
};

const useSectionProducts = ({
  limit = 12,
  section,
}: IGetProductsBySectionParams) => {
  return useInfiniteQuery({
    queryKey: ["section-products", limit, section],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const response = await Axios.get<IResponseType>(
        `/get-section-products/${section}`,
        {
          params: {
            page: pageParam,
            limit,
          },

          withCredentials: true,
        },
      );

      return response.data;
    },

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.page;
      const totalPages = lastPage?.pagination?.total_pages;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
  });
};

export default useSectionProducts;
