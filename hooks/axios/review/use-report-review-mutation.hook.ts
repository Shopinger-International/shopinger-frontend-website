import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

// types
import type { IReason } from "@/components/review/report-modal.component";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IRequestPayload = {
  review_id: number;
  reason: IReason;
  description?: string;
};

type IResponse = {
  success: boolean;
  message: string;
};

const useReportReviewMutation = () => {
  return useMutation<IResponse, Error, IRequestPayload>({
    async mutationFn({ review_id, ...payload }) {
      const { data } = await Axios.post<IResponse>(
        `/report-review/${review_id}`,
        payload,
      );
      return data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "report-review-success",
        variant: "success",
      });
    },

    onError(error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data?.message ?? "Something went wrong",
          {
            key: "report-review-error",
            variant: "error",
          },
        );
        return;
      }

      enqueueSnackbar("Unexpected error occured", {
        key: "report-review-error",
        variant: "error",
      });
    },
  });
};
export default useReportReviewMutation;
