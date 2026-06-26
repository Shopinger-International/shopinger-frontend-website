// types
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import SectionProducts from "@/components/section/section-products.component";

// provider
import FooterStateProvider from "@/provider/footer-state-provider";

// layout
import MainLayout from "@/components/layout/main-layout.component";

type IParams = {
  section: string;
};

type IProps = {
  section: string;
};
const SectionPage: NextPageWithLayout<IProps> = ({ section }) => {
  return (
    <section className="min-h-screen w-full">
      <div className="mx-auto mt-(--header-height) max-w-6xl space-y-3 pb-4">
        <SectionProducts section={section} />
      </div>
    </section>
  );
};

export default SectionPage;

SectionPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <FooterStateProvider default_show={false}>
      <MainLayout>{page}</MainLayout>
    </FooterStateProvider>
  );
};
export const getServerSideProps = (async ({ params }) => {
  if (!params) {
    return { notFound: true };
  }
  const section = params.section;
  return {
    props: {
      section,
    },
  };
}) satisfies GetServerSideProps<IProps, IParams>;
