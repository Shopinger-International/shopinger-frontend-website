// react query
import { useQuery } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type { ICart } from "@/types/cart";

// lib
import Axios from "@/lib/axios/private.lib";

type IResponse = ICart & {
  success: boolean;
};

const useCart = () => {
  return useQuery<IResponse, AxiosError>({
    queryKey: ["carts"],
    async queryFn() {
      const { data } = await Axios.get<IResponse>(`/get-cart`);
      return data;
    },
  });
};

export default useCart;
