import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react";
import type { FC } from "react";

import useCart from "@/hooks/axios/cart/use-cart.hook";

type IProps = {
  show_bottom_navigation: boolean;
};

const CartFloatingBar: FC<IProps> = ({ show_bottom_navigation }) => {
  const router = useRouter();
  const { data: cart } = useCart();

  if (
    !cart?.total_items ||
    cart.total_items < 1 ||
    router.pathname === "/cart-checkout" ||
    router.pathname.startsWith("/checkout/")
  )
    return null;

  const item_label = cart.total_items === 1 ? "item" : "items";
  const total_amount = cart.total_amount.toLocaleString("en-IN");
  const is_product_page = router.pathname.endsWith("[variant_id]");

  return (
    <Link
      href="/cart-checkout"
      aria-label={`View cart with ${cart.total_items} ${item_label}. Total ₹${total_amount}`}
      className="fixed inset-x-4 z-40 mx-auto flex max-w-2xl items-center justify-between rounded-xl bg-green-700 px-4 py-3 text-white shadow-lg transition-transform active:scale-[0.99] lg:hidden"
      style={{
        bottom: show_bottom_navigation
          ? "calc(var(--bottom-nav-height, 4rem) + env(safe-area-inset-bottom) + 0.75rem)"
          : is_product_page
            ? "calc(env(safe-area-inset-bottom) + 5rem)"
            : "calc(env(safe-area-inset-bottom) + 1rem)",
      }}
    >
      <span className="flex min-w-0 items-baseline gap-2 whitespace-nowrap">
        <span className="text-lg leading-tight font-bold">₹{total_amount}</span>
        <span className="text-xs">
          {cart.total_items} {item_label}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-2 text-sm font-semibold">
        View cart
        <ArrowRight className="size-4" aria-hidden="true" />
      </span>
    </Link>
  );
};

export default CartFloatingBar;
