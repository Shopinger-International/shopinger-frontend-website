// types
import type { FC } from "react";
import type { IOrderStatus, IOrderStatusHistory } from "@/types/order";

// helpers
import clsx from "clsx";
import { format } from "date-fns";

// const
import ORDER_STATUS from "@/constants/order-status.constant";

// icons
import {
  CircleCheckBig,
  CreditCard,
  PackageCheck,
  PackageSearch,
  PackageX,
  Truck,
} from "lucide-react";

// hooks
import { useConnectionStateListener, useChannel } from "ably/react";
import { useQueryClient } from "@tanstack/react-query";

const steps = [
  {
    label: "Confirmed",
    icon: CreditCard,
    status: ORDER_STATUS.ORDER_CREATED,
  },
  {
    label: "Processing",
    icon: PackageSearch,
    status: ORDER_STATUS.PROCESSING,
  },
  {
    label: "Picked up",
    icon: PackageCheck,
    status: ORDER_STATUS.PICKED_UP,
  },
  {
    label: "Out for delivery",
    icon: Truck,
    status: ORDER_STATUS.OUT_FOR_DELIVERY,
  },
  {
    label: "Delivered",
    icon: CircleCheckBig,
    status: ORDER_STATUS.DELIVERED,
  },
];

type Props = {
  order_id: number;
  order_status: IOrderStatus;
  order_status_history: IOrderStatusHistory[];
};

const OrderStatusMobile: FC<Props> = ({
  order_id,
  order_status_history,
  order_status,
}) => {
  const query_client = useQueryClient();
  const is_cancelled = order_status === ORDER_STATUS.CANCELLED;

  const updated_steps = is_cancelled
    ? [
        ...steps.slice(0, -1),
        {
          label: "Cancelled",
          icon: PackageX,
          status: ORDER_STATUS.CANCELLED,
        },
      ]
    : steps;
  useConnectionStateListener((state_change) => {
    console.log(
      "value of state change",
      state_change.current,
      state_change.reason,
    );
  });
  useChannel(`order-tracking:${order_id}`, (message) => {
    console.log("value fo message data", message);
    if (message.name == "status-updated") {
      console.log("value of data inside it", message, query_client);
      console.log("invalidate key", ["order", String(order_id)]);
      console.log(
        query_client
          .getQueryCache()
          .getAll()
          .map((q) => q.queryKey),
      );
      query_client.refetchQueries({
        queryKey: ["order", order_id],
      });
      console.log('invalidated')
    }
  });

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-5 sm:hidden">
      {/* Header */}
      <h2 className="mb-5 text-sm font-semibold text-gray-900">Order Status</h2>

      {/* Timeline */}
      <div className="relative">
        {updated_steps.map((step, index) => {
          const Icon = step.icon;

          const order_status_date = order_status_history.find(
            (status_history) => status_history.to_status === step.status,
          )?.created_at;

          const is_current = step.status === order_status;

          const is_completed = order_status_history.some(
            (status_history) => status_history.to_status === step.status,
          );

          const is_cancelled_step =
            is_cancelled && step.status === ORDER_STATUS.CANCELLED;

          const is_upcoming =
            !is_completed && !is_current && !is_cancelled_step;

          const next_step = updated_steps[index + 1];

          const is_connected_completed =
            is_completed ||
            (!is_cancelled && next_step?.status === order_status);

          return (
            <div key={step.status} className="relative flex gap-4 pb-7">
              {/* connector line */}
              {index !== updated_steps.length - 1 && (
                <div
                  className={clsx("absolute top-10 left-5 h-full w-0.5", {
                    "bg-orange-500": is_connected_completed,

                    "bg-gray-300": !is_connected_completed,

                    "bg-red-500": is_cancelled_step,
                  })}
                />
              )}

              {/* icon */}
              <div
                className={clsx(
                  "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  {
                    // completed
                    "border-orange-500 bg-orange-500 text-white":
                      !is_current && is_completed && !is_cancelled_step,

                    // current active step
                    "scale-110 border-orange-500 bg-white text-orange-500 shadow-md":
                      is_current && !is_cancelled,

                    // cancelled
                    "border-red-500 bg-red-500 text-white": is_cancelled_step,

                    // upcoming
                    "border-gray-300 bg-white text-gray-300": is_upcoming,
                  },
                )}
              >
                <Icon size={18} />
              </div>

              {/* content */}
              <div className="flex flex-col pt-0.5">
                {/* label */}
                <span
                  className={clsx("text-sm font-medium", {
                    "font-semibold text-gray-900": is_current && !is_cancelled,

                    "text-gray-700": is_completed && !is_cancelled_step,

                    "font-medium text-red-500": is_cancelled_step,

                    "text-gray-400": is_upcoming,
                  })}
                >
                  {step.label}
                </span>

                {/* date */}
                {order_status_date && (
                  <span className="mt-1 text-xs text-gray-600">
                    {format(new Date(order_status_date), "dd MMM yyyy")}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatusMobile;
