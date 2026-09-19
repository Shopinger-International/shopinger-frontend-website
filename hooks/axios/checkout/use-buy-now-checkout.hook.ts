// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import IOrder, { IOrderStatus } from "@/types/order";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequest = {
  intent_id: string;
  address_id: number;
  payment_mode?: IOrder["payment_mode"];
  gst?: number;
  delivery_fee?: number;
};

type IResponse = {
  order_id: number;
  reservation_id: string;
  reused: boolean;
  order: Omit<IOrder, "order_items"> & {
    order_items: Array<{
      id: number;
      product_id: number;
      product: {
        sub_sub_category_id: number;
      };
      variant_id: number;
      product_name: string;
      variant_sku: string;
      quantity: number;
      price: number;
      vendor_id: number;
      order_item_status: IOrderStatus;
    }>;
  };
};

const useBuyNowCheckoutMutation = () => {
  const query_client = useQueryClient();

  return useMutation<IResponse, AxiosError<{ message: string }>, IRequest>({
    mutationFn: async (payload) => {
      const { data } = await Axios.post<{
        message: string;
        data: IResponse;
        success: boolean;
      }>("/checkout/buy-now-checkout", payload);

      return data.data;
    },

    onSuccess() {
      query_client.invalidateQueries({
        queryKey: ["carts"],
      });
    },

    onError(error) {
      enqueueSnackbar(error.response?.data?.message || "Something went wrong", {
        key: `buy-now-checkout-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};

export default useBuyNowCheckoutMutation;
