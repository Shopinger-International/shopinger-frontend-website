import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import AddressDetail from "@/components/manage-address/addresses-detail.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

const ManageAddress: NextPageWithLayout = () => {
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
      <section className="min-h-screen w-full py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Your Addresses
            </h1>
          </div>
          <AddressDetail />
        </div>
      </section>
    </>
  );
};

export default ManageAddress;

ManageAddress.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
