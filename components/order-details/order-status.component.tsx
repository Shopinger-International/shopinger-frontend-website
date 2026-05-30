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
  CircleX,
  CreditCard,
  PackageCheck,
  PackageSearch,
  PackageX,
  Truck,
} from "lucide-react";

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

type IProps = {
  order_status: IOrderStatus;
  order_status_history: IOrderStatusHistory[];
};

const OrderStatus: FC<IProps> = ({ order_status_history, order_status }) => {
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

  return (
    <div className="rounded-xl border border-gray-300 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Order Status</h2>

        {is_cancelled && (
          <div className="flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-600">
            <CircleX size={16} />
            Cancelled
          </div>
        )}
      </div>

      <div className="flex items-start justify-between">
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
            <div
              key={step.status}
              className="relative flex flex-1 flex-col items-center"
            >
              {/* connector line */}
              {index !== updated_steps.length - 1 && (
                <div
                  className={clsx("absolute top-5 left-1/2 h-0.5 w-full", {
                    "bg-orange-500": is_connected_completed,

                    "bg-gray-300": !is_connected_completed,

                    "bg-red-500": is_cancelled_step,
                  })}
                />
              )}

              {/* icon */}
              <div
                className={clsx(
                  "z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300",
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

              {/* label */}
              <span
                className={clsx("mt-3 text-center text-sm transition", {
                  "font-semibold text-gray-900": is_current && !is_cancelled,

                  "text-gray-700": is_completed && !is_cancelled_step,

                  "text-red-500": is_cancelled_step,

                  "text-gray-400": is_upcoming,
                })}
              >
                {step.label}
              </span>

              {/* date */}
              <span
                className={clsx(
                  "mt-1 text-center text-xs",
                  order_status_date ? "text-gray-500" : "invisible",
                )}
              >
                {order_status_date
                  ? format(new Date(order_status_date), "dd MMM yyyy")
                  : "placeholder"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStatus;
