import { useRouter } from "next/router";
import Link from "next/link";
// types
import type { FC } from "react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// local components
import CartItem from "@/components/cart/cart-item.component";

// helpers
import clsx from "clsx";

type IProps = {
  handleShowLoginModal: () => void;
};

const CartDetails: FC<IProps> = ({ handleShowLoginModal }) => {
  const router = useRouter();
  const { data: user_detail } = useUserDetails();
  const { data: cart } = useCart();
  return (
    <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="col-span-1 h-min overflow-hidden rounded-xl border border-gray-300 bg-white lg:col-span-2">
        {cart?.items?.flatMap(({ variants, ...product }, index) => {
          return variants.map((variant) => (
            <CartItem
              product={product}
              variant={variant}
              key={`cart-item-${variant.id}`}
            />
          ));
        })}
      </div>
      <div className="h-max rounded-xl border border-gray-300 bg-white p-6 lg:sticky lg:top-(--header-height)">
        {/* HEADER */}
        <h3 className="font-semibold text-orange-500">Order Summary</h3>

        {/* PRICE BREAKDOWN */}
        <div className="mt-4 space-y-3 text-sm font-medium text-gray-600">
          {[
            {
              label: "Subtotal",
              value: `₹${cart?.total_amount}`,
            },
            {
              label: "Discount",
              value: `- ₹${cart?.total_discount}`,
            },
            {
              label: "Shipping",
              value: `₹${cart?.charges ?? 50}`,
            },
          ].map(({ label, value }) => (
            <div className="flex items-center justify-between" key={label}>
              <span>{label}</span>
              <span
                className={clsx(
                  "font-semibold",
                  label == "Discount" ? "text-orange-500" : "text-gray-900",
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* DIVIDER */}
        <div className="my-5 h-px bg-gray-600" />

        {/* TOTAL */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total</span>
          <span className="text-lg font-semibold text-gray-900">
            ₹{cart?.total_amount}
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          className="mt-4 w-full cursor-pointer rounded-md bg-orange-500 py-2 font-medium text-white"
          onClick={() =>
            user_detail ? router.push("/checkout") : handleShowLoginModal()
          }
        >
          Proceed to Checkout
        </button>

        <Link
          href="/"
          className="mt-3 flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-900"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartDetails;
