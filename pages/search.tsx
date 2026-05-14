// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CategoryProducts from "@/components/categories/category-products.component";

// provider
import FooterStateProvider from "@/provider/footer-state-provider";

type IProps = {
  category_slug: string;
};

const MainCategoryPage: NextPageWithLayout<IProps> = ({}) => {
  return (
    <>
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
      <MainLayout>{page}</MainLayout>
    </FooterStateProvider>
  );
};
