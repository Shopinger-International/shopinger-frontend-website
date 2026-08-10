// types
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import SectionProducts from "@/components/section/section-products.component";
import Seo from "@/components/common/seo";

// provider
import FooterStateProvider from "@/provider/footer-state-provider";

// layout
import MainLayout from "@/components/layout/main-layout.component";

const SECTION_CONFIG = {
  "trending-products": {
    title: "Trending Products | Shopinger",
    description:
      "Explore the most popular products on Shopinger. Shop trending groceries, fashion, electronics, beauty, home essentials, and more with fast delivery.",
    heading: "Trending Products",
  },

  "new-arrivals": {
    title: "New Arrivals | Shopinger",
    description:
      "Explore the latest products added to Shopinger. Discover new groceries, fashion, electronics, beauty, home essentials, and more with quick delivery.",
    heading: "New Arrivals",
  },

  "best-sellers": {
    title: "Best Sellers | Shopinger",
    description:
      "Browse the best selling products on Shopinger. Discover customer favorites across groceries, fashion, electronics, beauty, home essentials, and more.",
    heading: "Best Sellers",
  },

  "featured-products": {
    title: "Featured Products | Shopinger",
    description:
      "Discover handpicked featured products on Shopinger. Shop our recommended selection across groceries, fashion, electronics, beauty, home essentials, and more with fast delivery.",
    heading: "Featured Products",
  },
} as const;
export type ISectionKey = keyof typeof SECTION_CONFIG;
type IParams = {
  section: string;
};

type IProps = {
  section: ISectionKey;
};

const SectionPage: NextPageWithLayout<IProps> = ({ section }) => {
  const is_prod = process.env.NODE_ENV == "production";
  return (
    <>
      <Seo
        is_prod={is_prod}
        title={SECTION_CONFIG[section].title}
        description={SECTION_CONFIG[section].description}
        image={`${process.env.NEXT_PUBLIC_CDN_URL}/uploads/assets/dark-mobile-logo.png`}
        url="https://shopinger.com/"
      />
      <section className="min-h-screen w-full">
        <h1 className="sr-only">{SECTION_CONFIG[section].heading}</h1>
        <p className="sr-only">{SECTION_CONFIG[section].description}</p>
        <div className="mx-auto mt-(--header-height) max-w-6xl space-y-3 pb-4">
          <SectionProducts section={section} />
        </div>
      </section>
    </>
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
  if (!(section in SECTION_CONFIG)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      section: section as ISectionKey,
    },
  };
}) satisfies GetServerSideProps<IProps, IParams>;
