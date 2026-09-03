// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequest = {
  address_id: number;
  payment_mode: "COD" | "ONLINE";
};

type IResponse = {
  order_id: number;
  reservation_id: string;
  reused: boolean;
};

const useCartCheckoutMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, AxiosError, IRequest>({
    async mutationFn(payload) {
      const { data } = await Axios.post<{
        message: string;
        data: any;
        success: boolean;
      }>("/checkout", payload);
      return data.data;
    },
    onSuccess() {
      query_client.invalidateQueries({
        queryKey: ["carts"],
      });
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: `cart-checkout-${Date.now()}`,
        variant: "error",
      });
    },
  });
};

export default useCartCheckoutMutation;
