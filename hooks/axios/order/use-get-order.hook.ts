import Axios from "@/lib/axios/private.lib";

// types
import type { IAddress } from "@/types/address";
import type { AxiosError } from "axios";

// react query
import { useQuery } from "@tanstack/react-query";

export type IResponse = {
  data: IAddress[];
  success: boolean;
};

export const getUserOrders = async (cookie?: string) => {
  const { data } = await Axios.get<IResponse>(`/get-orders`, {
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });

  return data.data;
};

const useGetOrders = () => {
  return useQuery<IAddress[], AxiosError>({
    queryKey: ["orders"],
    async queryFn() {
      const user_orders = await getUserOrders();
      return user_orders;
    },
    staleTime: 1000 * 60 * 5,
  });
};
export default useGetOrders;
