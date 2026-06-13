// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequest = {
  product_id: number;
  variant_id: number;
};

type IResponse = {
  message: string;
  success: boolean;
  data: any;
};

const useCartItemRemoveMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, AxiosError, IRequest>({
    async mutationFn(payload) {
      const { data } = await Axios.post<{
        message: string;
        data: any;
        success: boolean;
      }>("/remove-cart-item", payload);
      return data;
    },

    onSuccess(response, { product_id, variant_id }) {
      query_client.invalidateQueries({
        queryKey: ["carts"],
      });

      query_client.invalidateQueries({
        queryKey: ["product-availability", product_id, variant_id],
      });
      enqueueSnackbar(response.message, {
        key: `remove-cart-item-success-${Date.now()}`,
        variant: "success",
      });
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: `remove-cart-item-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};

export default useCartItemRemoveMutation;
