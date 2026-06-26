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
import BestDeals from "@/components/home/best-deals/best-deals.component";
import CategorySection from "@/components/home/category/category-section.component";
import ProductRow from "@/components/home/product-row/product-row.component";
import Seo from "@/components/common/seo";

// lib
import { prefetchCommonData } from "@/lib/prefetch-common-data.lib";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

// hooks
import useFeed from "@/hooks/axios/home/use-feed.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// helpers
import { getCampaigns } from "@/hooks/axios/campaign/use-campaigns.hook";
import { getFeed } from "@/hooks/axios/home/use-feed.hook";

type IProps = {
  dehydratedState: DehydratedState;
};

const HomePage: NextPageWithLayout = () => {
  const { data: home_feed } = useFeed();
  const product_recommendations = home_feed?.product_recommendations ?? [];
  const continue_shopping_recommendations =
    home_feed?.continue_shopping_recommendations ?? [];
  const featured_products = home_feed?.featured_products ?? [];
  const buy_again_recommendations = home_feed?.buy_again_recommendations ?? [];
  const category_recommendations = home_feed?.category_recommendations ?? [];
  const trending_product_recommendations =
    home_feed?.trending_product_recommendations ?? [];

  const new_arrivals = home_feed?.new_arrivals ?? [];

  const best_seller_products = home_feed?.best_seller_products ?? [];
  const deals_of_the_day = home_feed?.deals_of_the_day ?? [];

  const show_trending_section = trending_product_recommendations.length >= 6;
  const show_new_arrivals_section = new_arrivals.length >= 6;
  const show_featured_section = featured_products.length >= 6;
  const show_best_seller_section = best_seller_products.length >= 6;
  const { data: user } = useUserDetails();
  const is_prod = process.env.NODE_ENV == "production";
  return (
    <>
      <Seo
        is_prod={is_prod}
        title="Shopinger | Everything Delivered in Minutes"
        description="Get groceries, fashion, electronics, beauty products, home essentials, and more delivered to your doorstep in minutes. Experience fast and reliable quick commerce with Shopinger."
        image="https://shopinger-uploads.s3.ap-south-1.amazonaws.com/uploads/assets/dark-mobile-logo.png"
        url="https://shopinger.com/"
      />
      <div className="space-y-4 pt-(--header-height)">
        <div className="max-w-8xl mx-auto w-full space-y-4 px-4">
          <Campaign />
          {/* <ProductMarquee /> */}
          {continue_shopping_recommendations.length >= 6 && (
            <ProductRow
              products={continue_shopping_recommendations}
              title={
                user?.name
                  ? `${user.name}, pick up where you left off`
                  : "Based on your recent browsing activity"
              }
              background_style="bg-[#FFE2D0]"
            />
          )}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {show_trending_section && (
              <ProductGrid
                title={"Trending Products"}
                products={trending_product_recommendations}
                view_all_href="section/trending-products"
              />
            )}
            {show_new_arrivals_section && (
              <ProductGrid
                title={"New Arrivals"}
                products={new_arrivals}
                view_all_href="section/new-arrivals"
              />
            )}
            {show_featured_section ? (
              <ProductGrid
                title={"Featured"}
                products={featured_products}
                view_all_href="section/featured-products"
              />
            ) : show_best_seller_section ? (
              <ProductGrid
                title={"Best Seller"}
                products={best_seller_products}
                view_all_href="section/best-seller"
              />
            ) : (
              <></>
            )}
          </div>

          {product_recommendations.length >= 6 && (
            <ProductRow
              products={product_recommendations}
              title={"Handpicked for You"}
              background_style="bg-lime-200"
            />
          )}
        </div>

        {category_recommendations.length >= 5 && (
          <CategorySection
            category_recommendations={category_recommendations}
          />
        )}
        <BestDeals products={deals_of_the_day} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<IProps> = async (
  context,
) => {
  const cookie = context.req.headers.cookie ?? "";
  const queryClient = new QueryClient();

  await Promise.all([
    prefetchCommonData(queryClient, cookie),
    queryClient.prefetchQuery({
      queryKey: ["campaigns"],
      queryFn: () => getCampaigns(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["feed"],
      queryFn: () => getFeed(cookie),
    }),
  ]);
  const dehydratedState = dehydrate(queryClient);
  return {
    props: {
      dehydratedState,
    },
  };
};

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export default HomePage;
