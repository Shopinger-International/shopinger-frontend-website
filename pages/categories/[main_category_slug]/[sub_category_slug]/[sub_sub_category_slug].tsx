// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";

// layout
import MainLayout from "@/components/layout/main-layout.component";

const SubSubCategoryPage: NextPageWithLayout = () => {
  return <div></div>;
};

export default SubSubCategoryPage;

SubSubCategoryPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
