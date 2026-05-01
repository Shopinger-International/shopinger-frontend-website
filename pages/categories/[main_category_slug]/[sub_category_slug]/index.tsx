// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CategoryProducts from "@/components/categories/category-products.component";

type IProps = {
  sub_category_slug: string;
};

const SubCategory: NextPageWithLayout<IProps> = ({ sub_category_slug }) => {
  return (
    <section className="min-h-screen w-full py-4">
      <div className="mx-auto mt-(--header-height) max-w-6xl space-y-4 px-4">
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
  return <MainLayout>{page}</MainLayout>;
};
