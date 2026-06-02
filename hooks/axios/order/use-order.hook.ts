import { AxiosError } from "axios";
// types
import type IOrder from "@/types/order";
import type IDeliveryPartner from "@/types/delivery-partner";

// react query
import { useQuery } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";

type IExtendedOrder = IOrder & {
  delivery_partner: IDeliveryPartner;
};

export type IResponse = {
  order: IExtendedOrder;
  success: boolean;
};

export const getOrderDetail = async (
  order_id: string,
  cookie?: string,
): Promise<IResponse["order"]> => {
  try {
    const { data } = await Axios.get<IResponse>(`/get-order/${order_id}`, {
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
  return useQuery<IResponse["order"], AxiosError>({
    queryKey: ["order", order_id],
    async queryFn() {
      return await getOrderDetail(order_id);
    },
    staleTime: 1000 * 60 * 5,
  });
};
export default useOrder;
