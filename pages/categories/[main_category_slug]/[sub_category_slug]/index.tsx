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

type IProps = {
  sub_category_slug: string;
};

const SubCategory: NextPageWithLayout<IProps> = ({ sub_category_slug }) => {
  return (
    <section className="min-h-screen w-full">
      <div className="max-w-8xl mx-auto mt-(--header-height) space-y-3">
        <CategoryProducts
          category_slug={sub_category_slug}
          category_type="sub"
        />
      </div>
    </section>
  );
};

export default SubCategory;

export const getServerSideProps = (async ({ params }) => {
  const sub_category_slug = params?.sub_category_slug as string;
  if (!sub_category_slug) {
    return { notFound: true };
  }
  return {
    props: {
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
