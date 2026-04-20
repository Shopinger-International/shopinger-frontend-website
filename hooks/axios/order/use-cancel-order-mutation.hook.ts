import { useMutation } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type { ICancelReason } from "@/types/order";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type ICancelOrderPayload = {
  order_id: number;
  items: { item_id: number; quantity: number }[];
  reason: ICancelReason;
};

export const cancelOrder = async ({
  order_id,
  items,
  reason,
}: ICancelOrderPayload) => {
  try {
    const response = await Axios.post(`/cancel-order/${order_id}`, {
      items,
      reason,
    });

    return response;
  } catch (error: any) {
    throw error;
  }
};

const useCancelOrderMutation = () => {
  return useMutation<
    any,
    AxiosError<{
      message: string;
    }>,
    ICancelOrderPayload
  >({
    async mutationFn(payload) {
      const response = await cancelOrder(payload);
      return response.data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "cancel-order-success",
        variant: "success",
      });
    },
    onError(error) {
      console.log("value of error", error);
      enqueueSnackbar(error.response?.data?.message ?? "Something went wrong", {
        key: "user-verify-login-otp-error",
        variant: "error",
      });
    },
  });
};

export default useCancelOrderMutation;
