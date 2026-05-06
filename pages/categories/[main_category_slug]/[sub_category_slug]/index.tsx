import Head from "next/head";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CategoryProducts from "@/components/categories/category-products.component";

// provider
import FiltersSortBarStateProvider from "@/provider/filter-sort-bar-state.provider";

// helpers
import { capitalizeValue } from "@/helpers/common.helper";

type IProps = {
  sub_category_slug: string;
  category_slug: string;
};

const SubCategory: NextPageWithLayout<IProps> = ({
  category_slug,
  sub_category_slug,
}) => {
  const category_name = sub_category_slug
    .split("-")
    .map((word) => capitalizeValue(word))
    .join(" ");
  return (
    <>
      <Head>
        <title>{category_name} | Shopinger</title>

        <meta
          name="description"
          content={`Shop the best ${category_name}. Explore top products, deals, and offers in ${category_name}.`}
          key="desc"
        />

        {/* Open Graph */}
        <meta property="og:site_name" content="Shopinger" />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category_slug}/${sub_category_slug}`}
        />
        <meta property="og:title" content={`${category_name} | Shopinger`} />
        <meta
          property="og:description"
          content={`Shop the best ${category_name}. Explore top products, deals, and offers.`}
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category_slug}/${sub_category_slug}`}
        />
        <meta name="twitter:title" content={`${category_name} | Shopinger`} />
        <meta
          name="twitter:description"
          content={`Shop the best ${category_name}. Explore top products, deals, and offers.`}
        />
        <meta name="twitter:site" content="@shopinger" />
        <meta name="twitter:creator" content="@shopinger" />
      </Head>
      <section className="min-h-screen w-full">
        <div className="max-w-8xl mx-auto mt-(--header-height) space-y-3 pb-4">
          <CategoryProducts
            category_slug={sub_category_slug}
            category_type="sub"
          />
        </div>
      </section>
    </>
  );
};

export default SubCategory;

export const getServerSideProps = (async ({ params }) => {
  const sub_category_slug = params?.sub_category_slug as string;
  const main_category_slug = params?.main_category_slug as string;
  if (!sub_category_slug) {
    return { notFound: true };
  }
  return {
    props: {
      category_slug: main_category_slug,
      sub_category_slug,
    },
  };
}) satisfies GetServerSideProps<IProps>;
SubCategory.getLayout = function getLayout(page: ReactElement) {
  return (
    <FiltersSortBarStateProvider>
      <MainLayout show_filter_sort_bar={true}>{page}</MainLayout>
    </FiltersSortBarStateProvider>
  );
};
