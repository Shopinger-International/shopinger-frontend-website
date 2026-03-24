import Link from "next/link";
import { useState } from "react";
import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import CartItem from "@/components/cart/cart-item.commponent";
import LoginModal from "@/components/login/login-modal.component";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";

// helpers
import clsx from "clsx";

const CartPage: NextPageWithLayout = () => {
  const [show_login_modal, setShowLoginModal] = useState(false);
  const { data } = useCart();

  return (
    <>
      <Head>
        <title>Your Cart | Shopinger</title>
        <meta
          name="description"
          content="Review the items in your cart, update quantities, and proceed to checkout securely on Shopinger."
          key="desc"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <LoginModal
        open={show_login_modal}
        handleClose={() => {
          setShowLoginModal(false);
        }}
      />
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          {/* Cart header */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Your Cart</h1>

            <span className="text-sm text-gray-500">
              {data?.total_items} items
            </span>
          </div>

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="col-span-1 h-min rounded-xl border border-gray-300 bg-white lg:col-span-2">
              {data?.items?.flatMap(({ variants, ...product }, index) => {
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
              <h3 className="font-semibold text-gray-900">Order Summary</h3>

              {/* PRICE BREAKDOWN */}
              <div className="mt-4 space-y-3 text-sm font-medium text-gray-600">
                {[
                  {
                    label: "Subtotal",
                    value: `₹${data?.sub_total}`,
                  },
                  {
                    label: "Discount",
                    value: `₹${data?.sub_total}`,
                  },
                  {
                    label: "Shipping",
                    value: `₹${data?.sub_total}`,
                  },
                ].map(({ label, value }) => (
                  <div className="flex items-center justify-between">
                    <span>{label}</span>
                    <span
                      className={clsx(
                        "font-semibold",
                        label == "Discount"
                          ? "text-orange-500"
                          : "text-gray-900",
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
                  ₹1837
                </span>
              </div>

              {/* CTA */}
              <button
                type="button"
                className="mt-4 w-full rounded-md bg-orange-500 py-2 font-medium text-white"
                onClick={() => setShowLoginModal(true)}
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="w-full rounded-md border border-gray-300 bg-white py-2 font-medium text-gray-900 flex items-center justify-center mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CartPage;

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
