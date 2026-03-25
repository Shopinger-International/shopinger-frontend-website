// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequest = {
  variant_id: number;
};

type IResponse = {
  message: string;
  success: boolean;
  data: any;
};

const useCartItemDecreaseMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, AxiosError, IRequest>({
    async mutationFn(payload) {
      const { data } = await Axios.post<{
        message: string;
        data: any;
        success: boolean;
      }>("/cart-decrease", payload);
      return data;
    },

    onSuccess(response) {
      query_client.invalidateQueries({
        queryKey: ["carts"],
      });
      enqueueSnackbar(response.message, {
        key: "cart-decrease-success",
        variant: "success",
      });
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "cart-decrease-error",
        variant: "error",
      });
    },
  });
};

export default useCartItemDecreaseMutation;
