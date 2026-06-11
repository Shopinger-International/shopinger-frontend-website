// types
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import CampaignProducts from "@/components/campaign/campaign-products.component";

// provider
import FooterStateProvider from "@/provider/footer-state-provider";

// layout
import MainLayout from "@/components/layout/main-layout.component";

type IParams = {
  campaign_id: string;
  campaign_slug: string;
};

type IProps = {
  campaign_id: number;
};
const CampaignPage: NextPageWithLayout<IProps> = ({ campaign_id }) => {
  return (
    <section className="min-h-screen w-full">
      <div className="mx-auto mt-(--header-height) max-w-6xl space-y-3 pb-4">
        <CampaignProducts campaign_id={campaign_id} />
      </div>
    </section>
  );
};

export default CampaignPage;

CampaignPage.getLayout = function getLayout(page: ReactElement) {
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
  const campaign_id = Number(params.campaign_id);
  return {
    props: {
      campaign_id,
    },
  };
}) satisfies GetServerSideProps<IProps, IParams>;
