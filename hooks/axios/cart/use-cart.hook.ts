// react query
import { useQuery } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type { ICart } from "@/types/cart";

// lib
import Axios from "@/lib/axios/private.lib";

export type IResponse = ICart & {
  success: boolean;
};

/**
 * Accepting cookie because on ssr no cookies
 * are passed with credientials
 */
export const getCart = async (cookie?: string) => {
  const { data } = await Axios.get<IResponse>(`/get-cart`, {
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });

  return data;
};

const useCart = () => {
  return useQuery<IResponse, AxiosError>({
    queryKey: ["carts"],
    async queryFn() {
      const cart_details = await getCart();
      return cart_details;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export default useCart;
