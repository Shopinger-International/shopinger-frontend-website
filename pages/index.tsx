import Head from "next/head";
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import PromoBanner from "@/components/home/promo-banner.component";
import SaleLiveSection from "@/components/home/sale-live-section.component";
import WatchLiveSection from "@/components/home/watch-live-section.component";
import ProductMarquee from "@/components/home/product-marquee.component";
import BestDeals from "@/components/home/best-deals/best-deals.component";
import DiscountSection from "@/components/home/discount/discount-section.component";

// lib
import { prefetchCommonData } from "@/lib/prefetch-common-data.lib";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

const HomePage: NextPageWithLayout = () => {
  return (
    <>
      <div className="space-y-4 pt-(--header-height)">
        <div className="max-w-8xl mx-auto w-full space-y-4 px-4">
          <PromoBanner />
          <ProductMarquee />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[60%_1fr]">
            {/* Sale Live Section */}
            <SaleLiveSection />
            <WatchLiveSection />
          </div>
        </div>
        <BestDeals />
        <DiscountSection />
      </div>
    </>
  );
};


type Props = {
  dehydratedState: DehydratedState;
};
export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const cookie = context.req.headers.cookie ?? "";
  const queryClient = new QueryClient();

  await prefetchCommonData(queryClient, cookie);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default HomePage;
