import { useState } from "react";
// types
import type { FC } from "react";
import type ICoord from "@/types/coord";

// local components
import RouteMap from "@/components/common/map/map-route/map-route.component";

// lib
import { useConnectionStateListener } from "ably/react";

// hooks
import { useChannel } from "ably/react";

const OrderTracking: FC<{
  order_id: number;
  end_coords: ICoord;
}> = ({ order_id, end_coords }) => {
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
    const current_delivery_partner_coords = message.data as ICoord;
    setDeliveryPartnerCoords(current_delivery_partner_coords);
  });
  console.log("value of delivery partner coords",delivery_partner_coords);

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
