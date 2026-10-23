import { useRouter } from "next/router";
// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

export const CART_EMPTY_ADD_EVENT = "cart-empty-item-added";

type IRequest = {
  product_id: number;
  variant_id: number;
  quantity: number;
};

type IResponse = {
  message: string;
  success: boolean;
  data: any;
};

const useAddToCartMutation = () => {
  const router = useRouter();
  const query_client = useQueryClient();
  return useMutation<
    IResponse,
    AxiosError,
    IRequest,
    { was_cart_empty: boolean }
  >({
    async mutationFn(payload) {
      const { data } = await Axios.post<{
        message: string;
        data: any;
        success: boolean;
      }>("/add-to-cart", payload);
      return data.data;
    },

    onMutate() {
      const cached_cart = query_client.getQueryData<{ total_items?: number }>([
        "carts",
      ]);
      return { was_cart_empty: cached_cart?.total_items === 0 };
    },
    onSuccess(response, { product_id, variant_id }, context) {
      if (typeof window !== "undefined" && context?.was_cart_empty) {
        window.dispatchEvent(new Event(CART_EMPTY_ADD_EVENT));
      }

      query_client.invalidateQueries({
        queryKey: ["carts"],
      });
      query_client.invalidateQueries({
        queryKey: ["product-availability", product_id, variant_id],
      });
      // enqueueSnackbar(response.message, {
      //   key: `add-to-cart-success-${Date.now()}`,
      //   variant: "success",
      //   action_label: "View Cart",
      //   onActionClick: () => router.push("/cart-checkout"),
      // });
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: `add-to-cart-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};

export default useAddToCartMutation;
