import { useInfiniteQuery } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

type IWishlist = {
  product_id: number;
  variant_id: number;
  title: string;
  media_url: string;
  mrp: number;
  selling_price: number;
  discount: number;
  sub_sub_category_id: number;
};

export type IResponseType = {
  message: string;
  pagination: {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
  data: Array<IWishlist>;
};

const useGetWishlist = ({ limit }: { limit: number }) => {
  return useInfiniteQuery({
    queryKey: ["wishlist"],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const { data } = await Axios.get<IResponseType>("/get-wishlist", {
        params: {
          page: pageParam,
          limit,
        },
      });

      return data;
    },

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.pagination;

      return page < total_pages ? page + 1 : undefined;
    },
  });
};

export default useGetWishlist;
