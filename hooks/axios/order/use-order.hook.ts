// types
import type IOrder from "@/types/order";
import type { AxiosError } from "axios";

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
  const {
    data: { order },
  } = await Axios.get<{
    success: boolean;
    order: IOrder;
  }>(`/get-order/${order_id}`, {
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });
  return order;
};

const useOrder = (order_id: string) => {
  return useQuery<IOrder, AxiosError>({
    queryKey: ["order", order_id],
    async queryFn() {
      const order = await getOrderDetail(order_id);
      return order;
    },
    staleTime: 1000 * 60 * 5,
  });
};
export default useOrder;
