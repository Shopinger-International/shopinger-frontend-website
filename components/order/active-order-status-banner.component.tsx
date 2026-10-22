import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronRight, PackageCheck, X } from "lucide-react";
import useGetOrders from "@/hooks/axios/order/use-get-order.hook";
import useIsMounted from "@/hooks/common/use-is-mounted.hook";
import clsx from "clsx";
// types
import type { IOrderStatus } from "@/types/order";

// Map backend statuses to user-facing messages (one status displayed at a time)
const STATUS_MESSAGES: Partial<Record<IOrderStatus, string>> = {
  ORDER_CREATED: "Your order is getting packed",
  PROCESSING: "Your order is getting packed",
  DELIVERY_ASSIGNED: "Your order is getting packed",
  PICKED_UP: "Your order is getting packed",
  OUT_FOR_DELIVERY: "Your order is out for delivery",
  DELIVERED: "Your order is delivered",
  CANCELLED: "Your order is cancelled",
};

const ActiveOrderStatusBanner = ({
  has_bottom_nav = false,
}: {
  has_bottom_nav?: boolean;
}) => {
  const pathname = usePathname();
  const is_mounted = useIsMounted();
  const { data: orders = [] } = useGetOrders();
  const [dismissed_ids, setDismissedIds] = useState<number[]>([]);
  const [is_scrolling_down, setIsScrollingDown] = useState(false);

  // Load dismissed order IDs from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dismissed_order_banner_ids");
      if (saved) {
        setDismissedIds(JSON.parse(saved));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Listen for page scroll to move banner down when scrolling down (matching bottom mobile nav)
  useEffect(() => {
    let prev_scroll_pos = window.pageYOffset;
    function handleScroll() {
      const current_scroll_pos = window.pageYOffset;
      if (current_scroll_pos > prev_scroll_pos && current_scroll_pos > 30) {
        setIsScrollingDown(true);
      } else {
        setIsScrollingDown(false);
      }
      prev_scroll_pos = current_scroll_pos;
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const delivered_or_cancelled_orders = orders.filter(
      (order) => order.status === "DELIVERED" || order.status === "CANCELLED",
    );

    if (!delivered_or_cancelled_orders.length) return;

    const timeout = window.setTimeout(() => {
      setDismissedIds((previous) => {
        const next = [
          ...new Set([
            ...previous,
            ...delivered_or_cancelled_orders.map((order) => order.id),
          ]),
        ];

        try {
          localStorage.setItem(
            "dismissed_order_banner_ids",
            JSON.stringify(next),
          );
        } catch {
          // Ignore storage errors
        }

        return next;
      });
    }, 10000); // 10 seconds

    return () => window.clearTimeout(timeout);
  }, [orders]);
  // Show banner ONLY on the home page ('/')
  if (pathname !== "/") return null;
  if (!is_mounted || !orders.length) return null;

  // Find all active orders (exclude PENDING and dismissed DELIVERED/CANCELLED orders)
  const active_orders = orders.filter((order) => {
    if (order.status === "PENDING") return false;
    if (dismissed_ids.includes(order.id)) return false;
    return true;
  });

  if (!active_orders.length) return null;

  const active_order = active_orders[0];

  const is_cancelled = active_order.status === "CANCELLED";
  const is_delivered = active_order.status === "DELIVERED";
  const status_text =
    STATUS_MESSAGES[active_order.status] || "Your order is in progress";

  const order_items = active_order.order_items || [];
  const first_item = order_items[0]?.item;
  const item_image = first_item?.product_medias?.[0]?.media?.url || "";

  // Calculate total item quantity in this order
  const total_items = order_items.reduce(
    (acc, curr) => acc + (curr.quantity || 1),
    0,
  );

  // Dismiss popup when user clicks ONLY IF order is DELIVERED or CANCELLED
  const handleBannerClick = () => {
    if (is_delivered || is_cancelled) {
      const next_dismissed = [...dismissed_ids, active_order.id];
      setDismissedIds(next_dismissed);
      try {
        localStorage.setItem(
          "dismissed_order_banner_ids",
          JSON.stringify(next_dismissed),
        );
      } catch {
        // ignore storage errors
      }
    }
  };

  return (
    <div
      className={clsx(
        "pointer-events-auto fixed left-1/2 z-40 w-[92%] max-w-md -translate-x-1/2 transition-all duration-300 ease-in-out sm:w-full",
        has_bottom_nav
          ? is_scrolling_down
            ? "bottom-4 lg:bottom-6"
            : "bottom-24 lg:bottom-6"
          : "bottom-4",
      )}
    >
      <Link
        href="/order-history"
        onClick={handleBannerClick}
        className={clsx(
          "group flex cursor-pointer items-center justify-between gap-3.5 rounded-2xl border border-white/20 p-2.5 text-white shadow-xl backdrop-blur-sm transition-all duration-200 active:scale-[0.99]",
          is_cancelled
            ? "border-red-500 bg-red-600 shadow-red-500/25 hover:shadow-2xl hover:shadow-red-500/35"
            : "border-emerald-500 bg-emerald-600 shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35",
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Item image container */}
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-300/50 bg-gray-200 p-0.5 shadow-inner">
            {item_image ? (
              <Image
                src={item_image}
                alt="Order item"
                fill
                className="rounded-lg object-cover"
              />
            ) : (
              <PackageCheck
                className={clsx(
                  "h-6 w-6",
                  is_cancelled ? "text-red-500" : "text-emerald-600",
                )}
              />
            )}

            {/* Subtle corner badge on product image for multiple items */}
            {total_items > 1 && (
              <div className="absolute right-0 bottom-0 z-10 flex items-center justify-center rounded-tl-md border-t border-l border-gray-300 bg-white/95 px-1.5 py-0.5 shadow-sm">
                <span className="text-[10px] leading-none font-black text-slate-900">
                  {total_items - 1}+
                </span>
              </div>
            )}
          </div>

          {/* Status info box */}
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-sm leading-tight font-bold tracking-tight text-white">
              {status_text}
            </p>
          </div>
        </div>

        {/* Action badge */}
        <div className="flex shrink-0 items-center gap-1 rounded-full bg-white/20 px-3.5 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-all group-hover:bg-white/30">
          <span>{is_cancelled ? "View" : "Track"}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          {(is_delivered || is_cancelled) && (
            <button
              type="button"
              aria-label="Dismiss order notification"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                handleBannerClick();
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ActiveOrderStatusBanner;
