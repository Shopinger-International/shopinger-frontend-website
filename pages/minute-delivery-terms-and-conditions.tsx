// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import Hero from "@/components/minutes-delivery-terms-and-condition/hero.component";
import PolicySection from "@/components/minutes-delivery-terms-and-condition/policy-section.component";

const MinutesDeliveryTermsAndConditions: NextPageWithLayout = () => {
  return (
    <div className="w-full bg-gray-50 py-2 sm:py-4">
      <div className="mx-auto mt-(--header-height) max-w-7xl px-2.5 sm:px-4">
        <Hero />
        <PolicySection />
      </div>
    </div>
  );
};

export default MinutesDeliveryTermsAndConditions;

MinutesDeliveryTermsAndConditions.getLayout = function getLayout(
  page: ReactElement,
) {
  return <MainLayout>{page}</MainLayout>;
};
