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

const AboutPage: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-4">
        <Hero />
        <OurPurpose />
        <GetInTouch />
        <CompanyDetails />
      </div>
    </div>
  );
};

export default AboutPage;

AboutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
