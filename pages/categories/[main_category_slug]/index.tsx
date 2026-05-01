// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CategoryProducts from "@/components/categories/category-products.component";

type IProps = {
  category_slug: string;
};

const MainCategoryPage: NextPageWithLayout<IProps> = ({ category_slug }) => {
  return (
    <section className="min-h-screen w-full py-4">
      <div className="mx-auto mt-(--header-height) max-w-6xl space-y-4 px-4">
        <CategoryProducts category_slug={category_slug} category_type="main" />
      </div>
    </section>
  );
};

export default MainCategoryPage;

export const getServerSideProps = (async ({ params, req }) => {
  const category_slug = params?.main_category_slug as string;
  if (!category_slug) {
    return { notFound: true };
  }
  return {
    props: {
      category_slug,
    },
  };
}) satisfies GetServerSideProps<IProps>;

MainCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
