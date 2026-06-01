import { useEffect, useState } from "react";
// types
import type { FC } from "react";
import type ICoord from "@/types/coord";

// local components
import RouteMap from "@/components/common/map/map-route/map-route.component";

// hooks

import { useConnectionStateListener, useChannel } from "ably/react";
import useGetDeliveryPartnerCurrentLocation from "@/hooks/axios/order/use-get-delivery-partner-current-location.hook";

const OrderTracking: FC<{
  order_id: number;
  end_coords: ICoord;
}> = ({ order_id, end_coords }) => {
  const { data: current_coords } = useGetDeliveryPartnerCurrentLocation({
    order_id,
  });
  const [delivery_partner_coords, setDeliveryPartnerCoords] =
    useState<ICoord>();
  useConnectionStateListener((state_change) => {
    console.log(
      "value of state change",
      state_change.current,
      state_change.reason,
    );
  });
  useChannel(`order-tracking:${order_id}`, (message) => {
    if (message.name == "location-update") {
      const current_delivery_partner_coords = message.data as ICoord;
      setDeliveryPartnerCoords(current_delivery_partner_coords);
    }
  });

  useEffect(() => {
    current_coords && setDeliveryPartnerCoords(current_coords);
  }, [current_coords]);

  return (
    <div className="h-60 w-full overflow-hidden rounded-xl border border-gray-300 sm:h-100">
      {delivery_partner_coords?.lat && delivery_partner_coords.lng && (
        <RouteMap
          start_chords={delivery_partner_coords}
          end_chords={end_coords}
          updatePosition={() => {}}
        />
      )}
    </div>
  );
};
export default OrderTracking;
