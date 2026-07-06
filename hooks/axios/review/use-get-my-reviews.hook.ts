import { useInfiniteQuery } from "@tanstack/react-query";
// types
import type IReview from "@/types/review";

// helpers
import Axios from "@/lib/axios/private.lib";

export type IProductReviewsPageType = {
  reviews: IReview[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export const getMyReviews = async (params?: {
  page?: number;
  limit?: number;
}): Promise<IProductReviewsPageType> => {
  const { data } = await Axios.get<{
    success: boolean;
    data: IProductReviewsPageType;
  }>(`/get-my-reviews`, {
    params,
  });

  return data.data;
};

const useGetMyReviews = ({ limit = 10 }: { limit?: number }) => {
  return useInfiniteQuery({
    queryKey: ["product-reviews"],
    queryFn: ({ pageParam = 1 }) =>
      getMyReviews({
        page: pageParam,
        limit,
      }),

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.pagination;

      return page < total_pages ? page + 1 : undefined;
    },

    initialPageParam: 1,
  });
};
export default useGetMyReviews;
