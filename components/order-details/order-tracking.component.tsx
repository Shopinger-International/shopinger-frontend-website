import type { FC } from "react";
import { useEffect } from "react";

// local components
import RouteMap from "@/components/common/map/map-route/map-route.component";

// lib
import { createAblyClient } from "@/lib/ably.lib";

const OrderTracking: FC<{
  order_id: number;
}> = ({ order_id }) => {
  // useEffect(() => {
  //   const ably = createAblyClient(order_id);
  //   ably.connection.on((stateChange) => {
  //     console.log("Ably state:", stateChange.current);
  //   });
  //   const channel_name = `order-tracking:${order_id}`;

  //   const channel = ably.channels.get(channel_name);
  //   const event_name = "location-update";
  //   console.log("value of channel", channel);

  //   const handler = (msg: any) => {
  //     console.log("Live location:", msg.data);
  //   };

  //   channel.subscribe(event_name, handler);

  //   return () => {
  //     channel.unsubscribe(event_name, handler);
  //     ably.close();
  //   };
  // }, []);

  return (
    <div className="h-100 w-full rounded-xl border border-gray-300 overflow-hidden">
      <RouteMap
        start_chords={{
          lat: 28.6129,
          lng: 77.2295,
        }}
        end_chords={{
          lat: 28.6139,
          lng: 77.3708,
        }}
        updatePosition={() => {}}
      />
    </div>
  );
};
export default OrderTracking;
