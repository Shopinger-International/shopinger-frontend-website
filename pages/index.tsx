// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import Campaign from "@/components/home/campaign.component";
import ProductGrid from "@/components/home/product-grid.component";
import ProductMarquee from "@/components/home/product-marquee.component";
import BestDeals from "@/components/home/best-deals/best-deals.component";
import CategorySection from "@/components/home/category/category-section.component";

// lib
import { prefetchCommonData } from "@/lib/prefetch-common-data.lib";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

// hooks
import useFeed from "@/hooks/axios/home/use-feed.hook";

const HomePage: NextPageWithLayout = () => {
  const { data: home_feed } = useFeed();
  const product_recommendations = home_feed?.product_recommendations ?? [];
  const continue_shopping_recommendations =
    home_feed?.continue_shopping_recommendations ?? [];
  const buy_again_recommendations = home_feed?.buy_again_recommendations ?? [];
  const category_recommendations = home_feed?.category_recommendations ?? [];
  const trending_product_recommendations =
    home_feed?.trending_product_recommendations ?? [];

  const new_arrivals = home_feed?.new_arrivals ?? [];

  const best_seller_products = home_feed?.best_seller_products ?? [];
  const deals_of_the_day = home_feed?.deals_of_the_day ?? [];
  return (
    <>
      <div className="space-y-4 pt-(--header-height)">
        <div className="max-w-8xl mx-auto w-full space-y-4 px-4">
          <Campaign />
          <ProductMarquee />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {product_recommendations.length >= 6 && (
              <ProductGrid
                title={"Recommended for you"}
                products={product_recommendations}
              />
            )}
            {continue_shopping_recommendations.length >= 6 && (
              <ProductGrid
                title={"Continue Shopping"}
                products={continue_shopping_recommendations}
              />
            )}
            {buy_again_recommendations.length >= 6 && (
              <ProductGrid
                title={"Buy Again"}
                products={buy_again_recommendations}
              />
            )}

            <ProductGrid
              title={"Trending Products"}
              products={trending_product_recommendations}
            />

            <ProductGrid title={"New Arrivals"} products={new_arrivals} />
            <ProductGrid
              title={"Best Seller"}
              products={best_seller_products}
            />
          </div>
        </div>
        <BestDeals products = {deals_of_the_day} />
        {category_recommendations.length >= 5 && (
          <CategorySection
            category_recommendations={category_recommendations}
          />
        )}
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
