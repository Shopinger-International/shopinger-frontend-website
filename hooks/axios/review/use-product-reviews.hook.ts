import { useInfiniteQuery, keepPreviousData } from "@tanstack/react-query";
// types
import type IReview from "@/types/review";
import type IMedia from "@/types/media";

// helpers
import Axios from "@/lib/axios/private.lib";

export type IFilterType = "recent" | "helpful" | "highest" | "lowest";

export type IProductReviewsPageType = {
  reviews: IReview[];
  summary: {
    average_rating: number;
    total_reviews: number;
    rating_breakdown: Record<number, number>;
    top_media: IMedia[];
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
};

export const getProductReviews = async (
  product_id: number,
  params?: {
    page?: number;
    limit?: number;
    rating?: number;
    sort?: IFilterType;
  },
): Promise<IProductReviewsPageType> => {
  const { data } = await Axios.get<{
    success: boolean;
    data: IProductReviewsPageType;
  }>(`/get-reviews/${product_id}`, {
    params,
  });

  return data.data;
};

const useProductReviews = ({
  productId,
  limit = 10,
  rating,
  sort = "recent",
}: {
  productId: number;
  limit?: number;
  rating?: number;
  sort?: "recent" | "helpful" | "highest" | "lowest";
}) => {
  return useInfiniteQuery({
    queryKey: ["product-reviews", productId, rating, sort],
    placeholderData: keepPreviousData,
    queryFn: ({ pageParam = 1 }) =>
      getProductReviews(productId, {
        page: pageParam,
        limit,
        rating,
        sort,
      }),

    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.pagination;

      return page < total_pages ? page + 1 : undefined;
    },

    initialPageParam: 1,
  });
};
export default useProductReviews;
