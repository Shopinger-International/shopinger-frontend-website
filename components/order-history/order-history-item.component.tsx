import Link from "next/link";
// types
import type { FC } from "react";
import type IOrder from "@/types/order";
import type { IOrderStatus } from "@/types/order";

// local compoment
import OrderHistoryProduct from "@/components/order-history/order-history-product.component";

// helper
import { format } from "date-fns";
import clsx from "clsx";

// const
import ORDER_STATUS from "@/constants/order-status.constant";

type IProps = {
  order: IOrder;
};

const STATUS_LABELS: Partial<Record<IOrderStatus, string>> = {
  ORDER_CREATED: "Confirmed",
  PROCESSING: "Processing",
  DELIVERY_ASSIGNED: "Assigned",
  PICKED_UP: "Picked Up",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
const OrderHistoryItem: FC<IProps> = ({ order }) => {
  const is_cancelled = order.status === ORDER_STATUS.CANCELLED;
  const is_delivered = order.status === ORDER_STATUS.DELIVERED;

  return (
    <div
      className={clsx(
        "rounded-2xl transition",
        is_cancelled
          ? "border border-red-500 bg-red-50/40"
          : "border border-gray-300 bg-white",
      )}
    >
      {/* HEADER */}
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-gray-900">
              Order #{order.order_name}
            </h3>

            <span
              className={clsx(
                "rounded-full px-2 py-0.5 text-xs font-medium",
                is_cancelled
                  ? "bg-red-100 text-red-600"
                  : is_delivered
                    ? "bg-green-100 text-green-600"
                    : "bg-orange-100 text-orange-600",
              )}
            >
              {STATUS_LABELS[order.status]}
            </span>
          </div>

          <p className="mt-1 text-sm font-medium text-gray-600">
            Placed on {format(order.created_at, "dd MMMM, yy")}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-lg font-semibold text-slate-900">
            ₹{order.total_amount || "0.00"}
          </p>
          <p className="text-sm font-medium text-gray-600">
            {order.order_items.length} items
          </p>
        </div>
      </div>

      {/* PRODUCTS */}
      <div className="border-t border-gray-300" />

      <div className="bg-gray-50/50 py-4">
        <div className="flex flex-col gap-6">
          {order?.order_items?.flatMap(
            ({ quantity, item: { variants, ...product } }) =>
              variants?.map((variant) => (
                <>
                  <OrderHistoryProduct
                    quantity={quantity}
                    variant={variant}
                    product={product}
                    key={`order-${order.id}-variant-${variant.id}`}
                  />
                </>
              )),
          )}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="border-t border-gray-300" />

      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/order-detail/${order.id}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View Details
          </Link>

          <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Invoice
          </button>
        </div>

        {!is_cancelled && (
          <button className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600">
            Reorder
          </button>
        )}
      </div>
    </div>
  );
};
export default OrderHistoryItem;
