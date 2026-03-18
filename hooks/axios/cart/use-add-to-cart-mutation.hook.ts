// react query
import { useMutation } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";

// lib
import Axios from "@/lib/axios/private.lib";

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
  return useMutation<IResponse, AxiosError, IRequest>({
    async mutationFn(payload) {
      const { data } = await Axios.post<{
        message: string;
        data: any;
        success: boolean;
      }>("/add-to-cart", payload);
      return data.data;
    },
  });
};

export default useAddToCartMutation;
