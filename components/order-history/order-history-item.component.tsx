import Link from "next/link";
import type { FC } from "react";
import type IOrder from "@/types/order";

// local compoment
import OrderHistoryProduct from "@/components/order-history/order-history-product.component";
import Badge from "@/components/product/badge.component";

import { formatDate } from "@/helpers/common.helper";

type IProps = {
  order: IOrder;
};

const statusStyles: Record<string, string> = {
  completed: "bg-green-100 text-green-700",
  processing: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-red-100 text-red-700",
  default: "bg-slate-100 text-slate-700",
};

const OrderHistoryItem: FC<IProps> = ({ order }) => {
  const statusClass =
    statusStyles[order.status?.toLowerCase()] || statusStyles.default;

  return (
    <div className="rounded-2xl border border-gray-300 bg-white">
      {/* Header */}
      <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-slate-900">
              Order #{order.id}
            </h3>

            <Badge className="bg-orange-500 text-white">{order.status}</Badge>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Placed on {formatDate(order.created_at)}
          </p>
        </div>

        <div className="text-left md:text-right">
          <p className="text-lg font-semibold text-slate-900">
            ₹{order.total_amount || "0.00"}
          </p>
          <p className="text-sm text-slate-500">
            {order.order_items.length} items
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Products */}
      <div className="flex flex-wrap gap-6 p-5">
        {order?.order_items?.flatMap(
          ({ quantity, item: { variants, ...product } }) =>
            variants?.map((variant) => (
              <OrderHistoryProduct
                key={`order-${order.id}-variant-${variant.id}`}
                quantity={quantity}
                variant={variant}
                product={product}
              />
            )),
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        {/* Left side (secondary actions) */}
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/order-detail/${order.id}`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            View Details
          </Link>

          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Invoice
          </button>
        </div>

        {/* Right side (primary action) */}
        <button className="rounded-lg bg-orange-500 px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-orange-600">
          Reorder
        </button>
      </div>
    </div>
  );
};

export default OrderHistoryItem;
