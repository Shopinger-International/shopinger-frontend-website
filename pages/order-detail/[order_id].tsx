import { useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";

// icons
import { CircleAlert } from "lucide-react";

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
import CancelOrderModal from "@/components/order-details/cancel-order-modal.component";
import OrderStatus from "@/components/order-details/order-status.component";
import OrderStatusMobile from "@/components/order-details/order-status-mobile.component";
import DeliveryPartnerDetails from "@/components/order-details/delivery-partner-details.component";

// provider
import { AblyProvider, ChannelProvider } from "ably/react";

// lib
import { createAblyClient } from "@/lib/ably.lib";

const OrderTracking = dynamic(
  import("@/components/order-details/order-tracking.component"),
  {
    ssr: false,
  },
);

// api hooks
import useOrder from "@/hooks/axios/order/use-order.hook";

// helpers
import { formatDate, capitalizeFirstLetter } from "@/helpers/common.helper";
import { getOrderDetail } from "@/hooks/axios/order/use-order.hook";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";
import ORDER_STATUS from "@/constants/order-status.constant";

const ably_client = createAblyClient();
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
  const { data: order } = useOrder(order_id);
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
  const total_order_items =
    order?.order_items.reduce((acc, { quantity }) => acc + quantity, 0) ?? 0;
  const total_cancelled_items =
    order?.order_items.reduce(
      (acc, { cancelled_quantity }) => acc + cancelled_quantity,
      0,
    ) ?? 0;
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
      <AblyProvider client={ably_client}>
        <section className="w-full bg-gray-50 py-6">
          <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
            {/* Header */}
            <div className="flex justify-between rounded-xl border border-gray-300 bg-white p-5">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  #{order.order_name}
                </h1>
                <p className="mt-1 text-sm text-gray-600">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>
              {/* ACTIONS */}
              <div className="flex items-center gap-3">
                {!order.order_status_history.some(({ to_status }) =>
                  [
                    ORDER_STATUS.OUT_FOR_DELIVERY,
                    ORDER_STATUS.CANCELLED,
                    ORDER_STATUS.DELIVERED,
                  ].includes(to_status),
                ) && (
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

            {/* Main Layout */}

            <ChannelProvider channelName={`order-tracking:${order.id}`}>
              <section className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* LEFT SECTION */}
                <div className="space-y-4 lg:col-span-2">
                  {/* Order Status */}
                  {!!order_status_history?.length && (
                    <>
                      <OrderStatus
                        order_status={order.status}
                        order_status_history={order_status_history}
                        order_id={Number(order_id)}
                      />
                      <OrderStatusMobile
                        order_status={order.status}
                        order_status_history={order_status_history}
                        order_id={Number(order_id)}
                      />
                    </>
                  )}
                  {order.status == "OUT_FOR_DELIVERY" ? (
                    <>
                      <OrderTracking
                        order_id={Number(order_id)}
                        end_coords={{
                          lat: order.address_snapshot.latitude,
                          lng: order.address_snapshot.longitude,
                        }}
                      />
                    </>
                  ) : (
                    ![ORDER_STATUS.CANCELLED, ORDER_STATUS.DELIVERED].includes(
                      order.status,
                    ) && (
                      <div className="h-60 w-full overflow-hidden rounded-xl border border-gray-300 bg-white sm:h-100">
                        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                          {/* Icon */}
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <CircleAlert className="size-8 text-orange-500" />
                          </div>

                          {/* Title */}
                          <p className="font-semibold text-gray-900">
                            Tracking not available yet
                          </p>

                          {/* Subtitle */}
                          <p className="mt-1 max-w-xs text-sm leading-relaxed font-medium text-gray-600">
                            Your order is being prepared. Live tracking will
                            start once the delivery partner is out for delivery.
                          </p>

                          {/* Status pill */}
                          <div className="mt-3 rounded-full bg-orange-500 px-3 py-1 text-[11px] font-medium text-white">
                            Preparing order
                          </div>
                        </div>
                      </div>
                    )
                  )}
                  <OrderSummary
                    username={order.address_snapshot.full_name}
                    country_code={order.address_snapshot.country_code}
                    phone={order.address_snapshot.phone}
                    payment_method={capitalizeFirstLetter(
                      order.payment_method ?? "Razorpay",
                    )}
                    address_snapshot={order.address_snapshot}
                  />
                  {order.delivery_partner && (
                    <DeliveryPartnerDetails
                      partner={{
                        name: order.delivery_partner.full_name,
                        phone: order.delivery_partner.phone,
                      }}
                    />
                  )}
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
                            is_delivered={
                              order.status == ORDER_STATUS.DELIVERED
                            }
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
                    delivery_fee={order.delivery_fee}
                    platform_fee={order.platform_fee}
                    invoice_url={order.invoice_url}
                  />
                  <HelpSection
                    title={"Need help with this order?"}
                    description={
                      "Get support for delivery, returns, or any issues with your order."
                    }
                  />
                </div>
              </section>
            </ChannelProvider>
          </div>
        </section>
      </AblyProvider>
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
