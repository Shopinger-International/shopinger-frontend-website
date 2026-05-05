import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type { IFilterType } from "@/hooks/axios/review/use-product-reviews.hook";
import type { IProductReviewsPageType } from "@/hooks/axios/review/use-product-reviews.hook";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IResponse = {
  success: boolean;
  message: string;
};
type IRequestPayload = {
  review_id: number;
};

const useDeleteReviewReactionMutation = (
  product_id: number,
  filter_state: IFilterType,
) => {
  const query_client = useQueryClient();
  return useMutation<IResponse, AxiosError<IResponse>, IRequestPayload>({
    async mutationFn({ review_id }) {
      const response = await Axios.delete<IResponse>(
        `/remove-reaction/${review_id}`,
      );
      return response.data;
    },
    onSuccess(response, { review_id }) {
      enqueueSnackbar(response.message, {
        key: "delete-review-reaction-success",
        variant: "success",
      });
      query_client.setQueryData(
        ["product-reviews", product_id, null, filter_state],
        (oldData: any) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page: IProductReviewsPageType) => ({
              ...page,
              reviews: page.reviews.map((review) => {
                if (review.id === review_id) {
                  return {
                    ...review,
                    is_reacted: false,
                    helpful_count: review.helpful_count - 1,
                  };
                }
                return review;
              }),
            })),
          };
        },
      );
    },
    onError(error) {
      enqueueSnackbar(error.response?.data?.message ?? "Something went wrong", {
        key: "delete-review-reaction-error",
        variant: "error",
      });
    },
  });
};
export default useDeleteReviewReactionMutation;
