import Link from "next/link";
import { useState } from "react";
import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type IProduct from "@/types/product";

// local components
import CartItem from "@/components/cart/cart-item.commponent";
import LoginModal from "@/components/login/login-modal.component";

// react query
import { useQuery } from "@tanstack/react-query";

// helpers
import webAxios from "@/lib/axios/web.lib";

const CartPage: NextPageWithLayout = () => {
  const [show_login_modal, setShowLoginModal] = useState(false);
  const { data: products = [] } = useQuery({
    queryKey: ["carts-item"],
    async queryFn() {
      const {
        data: { products },
      } = await webAxios.get<{
        success: boolean;
        products: IProduct[];
      }>(`/get-all-products`);
      return products;
    },
  });

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
              {products.length} items
            </span>
          </div>

          <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="col-span-1 h-min rounded-xl border border-gray-200 bg-white p-6 lg:col-span-2">
              <div className="divide-y divide-gray-200">
                {products.map(({ title, product_medias, variants }, index) => {
                  const variant_attribute_values =
                    variants[0].variant_attribute_values;

                  return (
                    <CartItem
                      key={index}
                      title={title}
                      main_image={product_medias[0].media.url}
                      variant_attribute_values={variant_attribute_values}
                    />
                  );
                })}
              </div>
            </div>

            {/* Order Summary */}
            <div className="h-max rounded-xl border border-gray-200 bg-white p-6 lg:sticky lg:top-(--header-height)">
              <h3 className="text-lg font-semibold text-gray-900">
                Order Summary
              </h3>

              <div className="mt-6 space-y-4 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">₹1997</span>
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-medium text-green-600">-₹200</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">₹40</span>
                </div>

                <div className="flex justify-between border-t pt-4 text-base font-semibold text-gray-900">
                  <span>Total</span>
                  <span>₹1837</span>
                </div>
              </div>

              {/* Checkout */}
              <button
                type="button"
                className="mt-6 w-full rounded-md bg-orange-500 py-3 text-sm font-semibold text-white hover:bg-orange-600"
                onClick={() => setShowLoginModal(true)}
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="mt-3 block w-full rounded-md border border-gray-300 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Continue Shopping
              </Link>

              {/* Promo code */}
              <div className="mt-6">
                <p className="mb-2 text-sm font-medium text-gray-900">
                  Promo Code
                </p>

                <div className="flex overflow-hidden rounded-md border border-gray-300">
                  <input
                    placeholder="Enter code"
                    className="w-full px-3 py-2 text-sm outline-none"
                  />

                  <button className="bg-gray-900 px-4 text-sm font-medium text-white hover:bg-black">
                    Apply
                  </button>
                </div>
              </div>
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
