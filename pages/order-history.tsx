import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import OrderHistoryItem from "@/components/order-history/order-history-item.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// hooks
import useGetOrders from "@/hooks/axios/order/use-get-order.hook";

// helpers
import clsx from "clsx";

const OrderHistoryPage: NextPageWithLayout = () => {
  const { data: orders = [] } = useGetOrders();
  console.log("value of data", orders);

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

      <div className="bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-96">
              <h2 className="mb-3 text-2xl font-bold text-slate-900">
                Order History
              </h2>
              <p className="text-base text-slate-600">
                View and manage your past orders
              </p>
            </div>
            <div>
              <input
                type="text"
                className="w-full rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-orange-600"
                placeholder="Search orders..."
              />
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[15px] font-medium text-slate-600">
                Filter by:
              </span>
              <button className="cursor-pointer rounded-md border border-orange-600 bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-700">
                All Orders
              </button>
              <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-gray-50">
                Completed
              </button>
              <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-gray-50">
                Processing
              </button>
              <button className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-gray-50">
                Cancelled
              </button>
            </div>
            <div className="ml-auto">
              <select className="w-full cursor-pointer appearance-none rounded-md border border-gray-400 bg-white px-4 py-2.5 text-sm text-slate-900 focus:outline-orange-600">
                <option>Sort by: Newest</option>
                <option>Sort by: Oldest</option>
                <option>Sort by: Price (High to Low)</option>
                <option>Sort by: Price (Low to High)</option>
              </select>
            </div>
          </div>
          <div className="mt-6 space-y-6">
            {orders.map((order) => (
              <OrderHistoryItem order={order} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderHistoryPage;

OrderHistoryPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
