import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequestPayload = {
  review_id: number;
};

type IResponse = {
  success: boolean;
  message: string;
};
const useDeleteReviewMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, Error, IRequestPayload>({
    async mutationFn({ review_id }) {
      const { data } = await Axios.delete<IResponse>(
        `/delete-review/${review_id}`,
      );
      return data;
    },
    onSuccess(response) {
      query_client.invalidateQueries({
        queryKey: ["user-reviews"],
      });
      enqueueSnackbar(response.message, {
        key: `delete-review-success-${Date.now()}`,
        variant: "success",
      });
    },
    onError(error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data?.message ?? "Something went wrong",
          {
            key: `delete-review-error-${Date.now()}`,
            variant: "error",
          },
        );
      } else {
        enqueueSnackbar("Unexpected error occured", {
          key: `delete-review-error-${Date.now()}`,
          variant: "error",
        });
      }
    },
  });
};
export default useDeleteReviewMutation;
