import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import OrderItem from "@/components/order-details/order-item.component";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";

// helpers

const OrderDetailPage: NextPageWithLayout = () => {
  const { data, isPending } = useCart();

  if (isPending) return null;
  return (
    <>
      <Head>
        <title>Order Detail | Shopinger</title>
        <meta
          name="description"
          content="Review the items in your cart, update quantities, and proceed to checkout securely on Shopinger."
          key="desc"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <h1 className="text-xl font-semibold">Order Details</h1>
          <p className="mt-2 flex items-center gap-4 text-sm text-gray-600">
            <span>Order Id : 171-6754116-9353937</span>
            <span>
              <span className="font-semibold text-gray-900">Date</span>: January
              20, 2026
            </span>
          </p>
          <section className="mt-4 space-y-4">
            <h2 className="font-semibold text-gray-900">
              {data?.items.length} items in this order
            </h2>

            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="col-span-1 space-y-4 lg:col-span-2">
                <div className="space-y-2">
                  {data?.items?.flatMap(({ variants, ...product }, index) => {
                    return variants.map((variant) => (
                      <OrderItem
                        product={product}
                        variant={variant}
                        key={`cart-item-${variant.id}`}
                      />
                    ));
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default OrderDetailPage;

OrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
