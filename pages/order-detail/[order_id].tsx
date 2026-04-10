import { useState } from "react";
import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// types
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type IOrder from "@/types/order";

// local components
import OrderItem from "@/components/order-details/order-item.component";
import BillSummary from "@/components/order-details/bill-summary.component";
import OrderSummary from "@/components/order-details/order-summary.component";
import HelpSection from "@/components/common/help-section.component";
import ReviewModal from "@/components/common/review/review-modal.component";

// hooks

// icon
import { CreditCard, Truck, CheckCircle } from "lucide-react";

// helpers
import clsx from "clsx";
import webAxios from "@/lib/axios/web.lib";
import { formateDate } from "@/helpers/common.helper";

const steps = [
  { label: "Confirmed", icon: CreditCard, status: "CONFIRMED" },
  { label: "Shipped", icon: Truck, status: "SHIPPED" },
  { label: "Delivered", icon: CheckCircle, status: "DELIVERED" },
];

// context
type IBaseReviewType = {
  open: boolean;
  product: Omit<IProduct, "variants"> | null;
  variant: IVariant | null;
};

const getOrderDetail = async (
  order_id: number,
  cookie: string,
): Promise<IOrder> => {
  const {
    data: { order },
  } = await webAxios.get<{
    success: boolean;
    order: IOrder;
  }>(`/get-order/${order_id}`, {
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });
  return order;
};

const OrderDetailPage: NextPageWithLayout<{
  order: IOrder;
}> = ({ order }) => {
  const [review_modal_state, setReviewModalState] = useState<IBaseReviewType>({
    open: false,
    product: null,
    variant: null,
  });
  const order_status_history = order.order_status_history;

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
      {review_modal_state.variant && review_modal_state.product && (
        <ReviewModal
          product={review_modal_state.product}
          variant={review_modal_state.variant}
          is_open={review_modal_state.open}
          onClose={() =>
            setReviewModalState({
              open: false,
              product: null,
              variant: null,
            })
          }
        />
      )}

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
          <section className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* LEFT SECTION */}
            <div className="space-y-4 lg:col-span-2">
              {/* Order Status */}
              <div className="rounded-xl border border-gray-300 bg-white p-6">
                <h2 className="mb-4 font-semibold text-gray-900">
                  Order Status
                </h2>

                <div className="flex items-center justify-between">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    const order_status_date = order_status_history.find(
                      (status_history) =>
                        status_history.to_status == step.status,
                    )?.created_at;

                    return (
                      <div
                        key={step.label}
                        className="relative flex flex-1 flex-col items-center"
                      >
                        {index !== steps.length - 1 && (
                          <div
                            className={clsx(
                              "absolute top-5 left-1/2 h-0.5 w-full",
                              steps[index].status == order.status
                                ? "bg-orange-500"
                                : "bg-gray-300",
                            )}
                          />
                        )}

                        <div
                          className={`z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            step.status === order.status
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
                            order_status_date ? "" : "invisible"
                          }`}
                        >
                          {order_status_date &&
                            formateDate(order_status_date) &&
                            ""}
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
                  {order?.order_items.length} items in this order
                </h2>

                <div className="space-y-4">
                  {order?.order_items?.flatMap(
                    ({ quantity, item: { variants, ...product } }) =>
                      variants.map((variant) => (
                        <OrderItem
                          quantity={quantity}
                          product={product}
                          variant={variant}
                          key={`cart-item-${variant.id}`}
                          is_delivered={true}
                          is_reviewed={false}
                          handleShowReviewModal={() =>
                            setReviewModalState({
                              open: true,
                              product,
                              variant,
                            })
                          }
                        />
                      )),
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION (SUMMARY CARD) */}
            <div className="flex flex-col gap-4">
              <BillSummary
                total_amount={order.total_amount}
                total_discount={order.discount}
                charges={50}
              />
              <HelpSection
                title={"Need help with this order?"}
                description={
                  "Get support for delivery, returns, or any issues with your order."
                }
              />
            </div>
          </section>
        </div>
      </section>
    </>
  );
};

export default OrderDetailPage;

export const getServerSideProps = (async (context) => {
  // Fetch data from external API
  const cookie = context.req.headers.cookie ?? "";
  const { order_id } = context.params as { order_id: string };
  const order = await getOrderDetail(Number(order_id), cookie);
  return { props: { order } };
}) satisfies GetServerSideProps<{ order: IOrder }>;

OrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
