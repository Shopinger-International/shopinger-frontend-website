import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

// local components
import OrderHistoryItem from "@/components/order-history/order-history-item.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// hooks
import useGetOrders from "@/hooks/axios/order/use-get-order.hook";

const OrderHistoryPage: NextPageWithLayout = () => {
  const { data: orders = [] } = useGetOrders();

  return (
    <>
      <Head>
        <title>Order History | Shopinger</title>
        <meta
          name="description"
          content="View and manage your past orders on Shopinger."
          key="desc"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="mx-auto mt-(--header-height) max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Order History</h1>
            <p className="mt-1 text-gray-600">
              Track, manage and review your orders
            </p>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderHistoryItem order={order} key={`order-item-${order.id}`} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-800">
                No orders yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Once you place an order, it will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;

OrderHistoryPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};
