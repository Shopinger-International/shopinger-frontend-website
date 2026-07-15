// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import Hero from "@/components/about-us/hero.component";
import OurPurpose from "@/components/about-us/our-purpose.component";
import GetInTouch from "@/components/about-us/get-in-touch.component";
import CompanyDetails from "@/components/about-us/company-details.component";

// seo
import Seo from "@/components/common/seo";

// helpers
import createAboutJSONLD from "@/seo/about-us.jsonld";

const AboutPage: NextPageWithLayout = () => {
  const is_prod = process.env.NODE_ENV == "production";
  const page_url = `${process.env.NEXT_PUBLIC_WEBSITE_URL}/about-us`;
  const title = "About Shopinger | Learn About Our Mission & Company";

  const description =
    "Learn about Shopinger, our mission, values, and commitment to delivering everyday essentials quickly and reliably.";
  const about_us_json_ld = createAboutJSONLD({
    title,
    description,
    url: page_url,
  });
  return (
    <>
      <Seo
        title={title}
        description={description}
        is_prod={is_prod}
        url={page_url}
        image="https://shopinger-uploads.s3.ap-south-1.amazonaws.com/uploads/assets/dark-mobile-logo.png"
        json_ld={JSON.stringify(about_us_json_ld)}
      />
      <div className="w-full bg-gray-50 py-2 sm:py-4">
        <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
          <Hero />
          <OurPurpose />
          <GetInTouch />
          <CompanyDetails />
        </div>
      </div>
    </>
  );
};

export default AboutPage;

AboutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
