import { useRouter } from "next/router";
import Head from "next/head";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CategoryProducts from "@/components/categories/category-products.component";

// provider
import FiltersSortBarStateProvider from "@/provider/filter-sort-bar-state.provider";
import FooterStateProvider from "@/provider/footer-state-provider";

type IProps = {
  category_slug: string;
};

const MainCategoryPage: NextPageWithLayout<IProps> = ({}) => {
  const { query } = useRouter();
  const search = typeof query.query == "string" ? query.query : undefined;

  return (
    <>
      <Head>
        <title>
          {search
            ? `${search} - Search Results | Shopinger`
            : "Search Products | Shopinger"}
        </title>

        <meta
          name="description"
          content={
            search
              ? `Find the best results for "${search}" on Shopinger. Compare products, prices, reviews, and deals.`
              : "Search and discover products, deals, and categories on Shopinger."
          }
        />

        {/* Canonical */}
        <link
          rel="canonical"
          href={
            search
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/search?q=${encodeURIComponent(search)}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/search`
          }
        />

        {/* Open Graph */}
        <meta property="og:site_name" content="Shopinger" />
        <meta property="og:type" content="website" />

        <meta
          property="og:url"
          content={
            search
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/search?q=${encodeURIComponent(search)}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/search`
          }
        />

        <meta
          property="og:title"
          content={
            search
              ? `${search} - Search Results | Shopinger`
              : "Search Products | Shopinger"
          }
        />

        <meta
          property="og:description"
          content={
            search
              ? `Browse products related to "${search}" on Shopinger.`
              : "Search products, brands, and deals on Shopinger."
          }
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />

        <meta
          name="twitter:url"
          content={
            search
              ? `${process.env.NEXT_PUBLIC_BASE_URL}/search?q=${encodeURIComponent(search)}`
              : `${process.env.NEXT_PUBLIC_BASE_URL}/search`
          }
        />

        <meta
          name="twitter:title"
          content={
            search
              ? `${search} - Search Results | Shopinger`
              : "Search Products | Shopinger"
          }
        />

        <meta
          name="twitter:description"
          content={
            search
              ? `Explore products matching "${search}" on Shopinger.`
              : "Search and explore products on Shopinger."
          }
        />

        <meta name="twitter:site" content="@shopinger" />
        <meta name="twitter:creator" content="@shopinger" />
      </Head>
      <section className="min-h-screen w-full">
        <div className="mx-auto mt-(--header-height) max-w-6xl space-y-3 pb-4">
          <CategoryProducts />
        </div>
      </section>
    </>
  );
};

export default MainCategoryPage;

MainCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <FooterStateProvider default_show={false}>
      <FiltersSortBarStateProvider>
        <MainLayout show_filter_sort_bar={true} disable_side_filter={true}>
          {page}
        </MainLayout>
      </FiltersSortBarStateProvider>
    </FooterStateProvider>
  );
};
