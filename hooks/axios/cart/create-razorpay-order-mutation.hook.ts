// react query
import { useMutation } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequest = {
  order_id: number;
};

type IResponse = {
  order_id: number;
  amount: number;
  currency: string;
};

const useCreateRazorpayOrderMutation = () => {
  return useMutation<IResponse, AxiosError, IRequest>({
    async mutationFn(payload) {
      const { data } = await Axios.post<{
        message: string;
        data: IResponse;
        success: boolean;
      }>("/create-razorpay-order", payload);
      return data.data;
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

export default useCreateRazorpayOrderMutation;
