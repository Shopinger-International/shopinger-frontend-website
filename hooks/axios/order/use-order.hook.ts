// types
import type IOrder from "@/types/order";
import { AxiosError } from "axios";

// react query
import { useQuery } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";

export type IResponse = {
  data: IOrder[];
  success: boolean;
};

export const getOrderDetail = async (
  order_id: string,
  cookie?: string,
): Promise<IOrder> => {
  try {
    const { data } = await Axios.get<{
      success: boolean;
      order: IOrder;
    }>(`/get-order/${order_id}`, {
      headers: cookie ? { cookie } : {},
    });

    return data.order;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Unexpected error occurred"); // React Query will catch it
  }
};
const useOrder = (order_id: string) => {
  return useQuery<IOrder, AxiosError>({
    queryKey: ["order", order_id],
    async queryFn() {
      return await getOrderDetail(order_id);
    },
    staleTime: 1000 * 60 * 5,
  });
};
export default useOrder;
