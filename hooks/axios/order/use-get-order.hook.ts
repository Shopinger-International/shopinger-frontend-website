import Axios from "@/lib/axios/private.lib";

// types
import type IOrder from "@/types/order";
import type { AxiosError } from "axios";

// react query
import { useQuery } from "@tanstack/react-query";

export type IResponse = {
  data: IOrder[];
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
  return useQuery<IOrder[], AxiosError>({
    queryKey: ["orders"],
    async queryFn() {
      const user_orders = await getUserOrders();
      return user_orders;
    },
    staleTime: 1000 * 60 * 5,
  });
};
export default useGetOrders;
