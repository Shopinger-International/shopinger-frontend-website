import { useState } from "react";
import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

// types
import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type IOrder from "@/types/order";
import type { IOrderItem } from "@/types/order";
import type { DehydratedState } from "@tanstack/react-query";

// local components
import OrderItem from "@/components/order-details/order-item.component";
import BillSummary from "@/components/order-details/bill-summary.component";
import OrderSummary from "@/components/order-details/order-summary.component";
import HelpSection from "@/components/common/help-section.component";
import ReviewModal from "@/components/common/review/review-modal.component";
import CancelOrderModal from "@/components/order-details/cancel-order.component";

// api hooks
import useOrder from "@/hooks/axios/order/use-order.hook";

// icon
import { CreditCard, Truck, CheckCircle } from "lucide-react";

// helpers
import clsx from "clsx";
import { formatDate } from "@/helpers/common.helper";
import { getOrderDetail } from "@/hooks/axios/order/use-order.hook";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

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
  order_item: IOrderItem | null;
};

const OrderDetailPage: NextPageWithLayout<{
  order_id: string;
}> = ({ order_id }) => {
  const { data: order } = useOrder(order_id) as { data: IOrder };
  const [review_modal_state, setReviewModalState] = useState<IBaseReviewType>({
    open: false,
    product: null,
    variant: null,
    order_item: null,
  });
  const [cancel_order_modal_state, setCancelOrderModalState] = useState<{
    open: boolean;
  }>({
    open: false,
  });
  const order_status_history = order?.order_status_history;
  const total_order_items = order?.order_items.reduce(
    (acc, { quantity }) => acc + quantity,
    0,
  );
  const total_cancelled_items = order?.order_items.reduce(
    (acc, { cancelled_quantity }) => acc + cancelled_quantity,
    0,
  );
  const total_active_items = total_order_items - total_cancelled_items;

  if (!order) {
    return null;
  }

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
          order_item={review_modal_state.order_item as IOrderItem}
          is_open={review_modal_state.open}
          onClose={() =>
            setReviewModalState({
              open: false,
              product: null,
              variant: null,
              order_item: null,
            })
          }
        />
      )}
      <CancelOrderModal
        is_open={cancel_order_modal_state.open}
        order={order}
        onClose={() =>
          setCancelOrderModalState({
            open: false,
          })
        }
        onConfirm={() => {}}
      />

      <section className="w-full bg-gray-50 py-6">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          {/* Header */}
          <div className="flex justify-between rounded-xl border border-gray-300 bg-white p-5">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Order ID: 171-6754116-9353937
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Placed on {formatDate(order.created_at)}
              </p>
            </div>
            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              {order.status === "CONFIRMED" && (
                <button
                  disabled={!total_active_items}
                  onClick={() => {
                    // TODO: replace with modal / API call
                    setCancelOrderModalState({
                      open: true,
                    });
                  }}
                  className="rounded-md border border-red-500 px-4 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 disabled:border-red-200 disabled:text-red-200"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
          {/* ACTIONS */}

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
                            formatDate(order_status_date) &&
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
                <h2 className="mb-2 font-semibold text-gray-900">
                  {total_active_items} items in this order
                </h2>
                {total_cancelled_items > 0 && (
                  <p className="mb-4 text-xs font-medium text-gray-600">
                    {total_cancelled_items} item
                    {total_cancelled_items !== 1 ? "s" : ""} cancelled
                  </p>
                )}

                <div className="space-y-4">
                  {order?.order_items?.flatMap((order_item) => {
                    const {
                      quantity,
                      item: { variants, ...product },
                      cancelled_quantity,
                    } = order_item;
                    return variants.map((variant) => (
                      <OrderItem
                        quantity={quantity}
                        cancelled_quantity={cancelled_quantity}
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
                            order_item,
                          })
                        }
                      />
                    ));
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT SECTION (SUMMARY CARD) */}
            <div className="flex flex-col gap-4">
              <BillSummary
                sub_total={order.sub_total}
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

type Props = {
  dehydratedState: DehydratedState;
  order_id: string;
};
export const getServerSideProps = (async (context) => {
  const cookie = context.req.headers.cookie ?? "";
  const { order_id } = context.params as { order_id: string };

  const queryClient = new QueryClient();

  try {
    await queryClient.fetchQuery<IOrder>({
      queryKey: ["order", order_id],
      queryFn: async () => {
        return await getOrderDetail(order_id, cookie);
      },
    });
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
        order_id,
      },
    };
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 404) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    if (status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // fallback: generic error page
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}) satisfies GetServerSideProps<Props>;
OrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
