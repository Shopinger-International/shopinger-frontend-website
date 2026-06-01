import type ICoord from "@/types/coord";
// hooks
import { useQuery } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

const useGetDeliveryPartnerCurrentLocation = ({
  order_id,
}: {
  order_id: number;
}) => {
  return useQuery<ICoord, Error>({
    queryKey: ["delivery-partner-current-location", order_id],
    async queryFn() {
      const { data } = await Axios.get<{
        success: boolean;
        data: ICoord;
      }>(`/get-delivery-partner-current-location/${order_id}`);
      return data.data;
    },
  });
};

export default useGetDeliveryPartnerCurrentLocation;
