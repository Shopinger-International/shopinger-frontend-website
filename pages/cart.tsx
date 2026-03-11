import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

const CartPage: NextPageWithLayout = () => {
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
      <section className="relative h-screen w-full">
        <div className="max-w-6xl mx-auto w-full border border-gray-800 px-4 h-screen"></div>
      </section>
    </>
  );
};

export default CartPage;

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
