// hooks
import { useInfiniteQuery } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";

export type IResponseType = {
  success: boolean;
  pagination: {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
  products: Array<{
    product_id: number;
    variant_id: number;
    title: string;
    selling_price: number;
    mrp: number;
    discount_percentage: number;
    stock: number;
    avg_rating: number;
    is_wishlisted: boolean;
    have_variants:boolean;
    sub_sub_category_id: number;
    created_at: string;
    bought_last_month: number;
    product_thumbnail: string;
  }>;
};
const useNProducts = ({ limit = 10 }: { limit: number }) => {
  return useInfiniteQuery({
    queryKey: ["n-products", limit],
    async queryFn({ pageParam }) {
      const response = await Axios.get<IResponseType>("/n-products", {
        params: {
          page: pageParam,
          limit,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      const totalPages = lastPage.pagination.total_pages;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
    initialPageParam: 1,
  });
};

export default useNProducts;
