import { useInfiniteQuery } from "@tanstack/react-query";
import Axios from "@/lib/axios/private.lib";

// types
import type IProduct from "@/types/product";

type IGetProductsByCampaignParams = {
  campaign_id: number;
  limit?: number;
};

export type IResponseType = {
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
      bought_last_month: number;
      is_wishlisted: boolean;
    }
  >;
};

const useCampaignProducts = ({
  limit = 12,
  campaign_id,
}: IGetProductsByCampaignParams) => {
  return useInfiniteQuery({
    queryKey: ["campaign-product", limit, campaign_id],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const response = await Axios.get<IResponseType>(
        `/get-campaign-product/${campaign_id}`,
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

export default useCampaignProducts;
