import { useMutation } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

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

const useReactToReviewMutation = () => {
  return useMutation<IResponse, AxiosError<IResponse>, IRequestPayload>({
    async mutationFn({ review_id }) {
      const response = await Axios.post<IResponse>(
        `/react-to-review/${review_id}`,
        {
          is_helpful: true,
        },
      );
      return response.data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "add-review-success",
        variant: "success",
      });
    },
    onError(error) {
      enqueueSnackbar(error.response?.data?.message ?? "Something went wrong", {
        key: "add-review-error",
        variant: "error",
      });
    },
  });
};
export default useReactToReviewMutation;
