import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import OrderItem from "@/components/order-details/order-item.component";
import BillSummary from "@/components/order-details/bill-summary.component";
import OrderSummary from "@/components/order-details/order-summary.component";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";

// icon
import { Package, CreditCard, Truck, CheckCircle } from "lucide-react";

// helpers
import clsx from "clsx";

const steps = [
  { label: "Placed", icon: Package, status: "done" },
  { label: "Paid", icon: CreditCard, status: "done" },
  { label: "Shipped", icon: Truck, status: "current" },
  { label: "Delivered", icon: CheckCircle, status: "upcoming" },
];

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
      <section className="w-full bg-gray-50 py-6">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          {/* Header */}
          <div className="rounded-xl border border-gray-300 bg-white p-5">
            <h1 className="text-lg font-semibold text-gray-900">
              Order ID: 171-6754116-9353937
            </h1>
            <p className="mt-1 text-sm text-gray-600">Placed on 12 Feb 2026</p>
          </div>

          {/* Main Layout */}
          <section className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* LEFT SECTION */}
            <div className="space-y-5 lg:col-span-2">
              {/* Order Status */}
              <div className="rounded-xl border border-gray-300 bg-white p-6">
                <h2 className="mb-4 font-semibold text-gray-900">
                  Order Status
                </h2>

                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className="relative flex flex-1 flex-col items-center"
                      >
                        {index !== steps.length - 1 && (
                          <div
                            className={clsx(
                              "absolute top-5 left-1/2 h-0.5 w-full",
                              steps[index].status == "done"
                                ? "bg-orange-500"
                                : "bg-gray-300",
                            )}
                          />
                        )}

                        <div
                          className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            step.status === "done"
                              ? "border-orange-500 bg-orange-500 text-white"
                              : step.status === "current"
                                ? "scale-110 border-orange-500 bg-white text-orange-500 shadow-md"
                                : "border-gray-300 bg-white text-gray-300"
                          }`}
                        >
                          <Icon size={18} />
                        </div>

                        <span
                          className={clsx(
                            "mt-2 text-sm transition",
                            steps[index].status == "current"
                              ? "font-semibold text-gray-900"
                              : "text-gray-600",
                          )}
                        >
                          {step.label}
                        </span>

                        {/* Optional date */}
                        <span
                          className={`text-xs text-gray-600 ${
                            step.status === "upcoming" ? "invisible" : ""
                          }`}
                        >
                          12 Feb
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <OrderSummary />
              {/* Order Items */}
              <div className="rounded-xl border border-gray-300 bg-white p-6">
                <h2 className="mb-4 font-semibold text-gray-900">
                  {data?.items.length} items in this order
                </h2>

                <div className="space-y-4">
                  {data?.items?.flatMap(({ variants, ...product }) =>
                    variants.map((variant) => (
                      <OrderItem
                        product={product}
                        variant={variant}
                        key={`cart-item-${variant.id}`}
                      />
                    )),
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION (SUMMARY CARD) */}
            <div className="flex flex-col gap-5">
              <BillSummary
                total_amount={1499}
                total_discount={200}
                charges={50}
              />
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
