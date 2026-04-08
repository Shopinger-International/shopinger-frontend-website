// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type IOrder from "@/types/order";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequest = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amount: number;
  currency: string;
};

type IResponse = {
  order: IOrder;
};

const useVerifyPaymentMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, AxiosError, IRequest>({
    async mutationFn(payload) {
      const { data } = await Axios.post<{
        message: string;
        data: IResponse;
        success: boolean;
      }>("/verify-payment", payload);
      return data.data;
    },
    onSuccess(response) {
      query_client.invalidateQueries({
        queryKey: ["carts"],
      });
      console.log("value of response", response);
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: `create-razorpay-order-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};

export default useVerifyPaymentMutation;
