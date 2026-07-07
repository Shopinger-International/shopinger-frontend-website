import { useQueryClient } from "@tanstack/react-query";
// types
import type { AxiosError } from "axios";

// react query
import { useMutation } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IResponse = {
  success: boolean;
  message: string;
  data: any;
};

const useAddReviewMutation = () => {
  const query_client = useQueryClient();
  return useMutation<
    IResponse,
    AxiosError<{
      message: string;
    }>,
    FormData
  >({
    async mutationFn(payload) {
      const { data } = await Axios.post<IResponse>("/add-review", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    },
    onSuccess(response) {
      query_client.invalidateQueries({
        queryKey: ["user-reviews"],
      });
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

export default useAddReviewMutation;
