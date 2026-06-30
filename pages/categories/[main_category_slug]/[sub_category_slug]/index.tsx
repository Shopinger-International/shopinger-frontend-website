// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CategoryProducts from "@/components/categories/category-products.component";
import Seo from "@/components/common/seo";

// provider
import FiltersSortBarStateProvider from "@/provider/filter-sort-bar-state.provider";
import FooterStateProvider from "@/provider/footer-state-provider";

// helpers
import { capitalizeValue } from "@/helpers/common.helper";
import createCategoryJSONLD from "@/seo/category.jsonld";

// analytics
import useCategoryViewed from "@/hooks/analytics/use-category-viewed.hook";

type IProps = {
  sub_category_slug: string;
  category_slug: string;
};

const SubCategory: NextPageWithLayout<IProps> = ({
  category_slug,
  sub_category_slug,
}) => {
  useCategoryViewed({
    category_slug: sub_category_slug,
    category_type: "SUB",
  });
  const category_name = sub_category_slug
    .split("-")
    .map((word) => capitalizeValue(word))
    .join(" ");
  const is_prod = process.env.NODE_ENV == "production";

  const description = `Discover ${category_name} products at great prices on Shopinger. Browse top brands, exclusive deals, and get fast delivery in minutes.`;
  const page_url = `${process.env.NEXT_PUBLIC_BASE_URL}/categories/${category_slug}/${sub_category_slug}`;
  const json_ld = createCategoryJSONLD({
    title: category_name,
    description,
    url: page_url,
  });
  return (
    <>
      <Seo
        title={`Shop ${category_name} Online | Shopinger`}
        description={description}
        url={page_url}
        image={
          "https://shopinger-uploads.s3.ap-south-1.amazonaws.com/uploads/assets/dark-mobile-logo.png"
        }
        is_prod={is_prod}
        json_ld={JSON.stringify(json_ld)}
      />
      <section className="min-h-screen w-full">
        <h1 className="sr-only">Shop {category_name} Online</h1>

        <p className="sr-only">
          Browse {category_name} products on Shopinger. Discover top brands,
          great deals, and fast delivery on a wide range of{" "}
          {category_name.toLowerCase()}.
        </p>
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
    <FooterStateProvider default_show={false}>
      <FiltersSortBarStateProvider>
        <MainLayout show_filter_sort_bar={true}>{page}</MainLayout>
      </FiltersSortBarStateProvider>
    </FooterStateProvider>
  );
};
