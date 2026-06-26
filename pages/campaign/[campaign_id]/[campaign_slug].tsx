// types
import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import type { NextPageWithLayout } from "@/pages/_app";
import type { DehydratedState } from "@tanstack/react-query";
import type ICampaign from "@/types/campaign";

// local components
import CampaignProducts from "@/components/campaign/campaign-products.component";
import Seo from "@/components/common/seo";

// provider
import FooterStateProvider from "@/provider/footer-state-provider";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// lib
import { prefetchCommonData } from "@/lib/prefetch-common-data.lib";
import { QueryClient, dehydrate } from "@tanstack/react-query";

// helpers
import { getCampaigns } from "@/hooks/axios/campaign/use-campaigns.hook";

// hooks
import useAllCamapigns from "@/hooks/axios/campaign/use-campaigns.hook";

type IParams = {
  campaign_id: string;
  campaign_slug: string;
};

type IProps = {
  dehydratedState: DehydratedState;
  campaign_id: number;
};
const CampaignPage: NextPageWithLayout<IProps> = ({ campaign_id }) => {
  const { data: campaigns = [] } = useAllCamapigns();
  const campaign = campaigns.find(
    (campaign) => campaign.id == campaign_id,
  ) as ICampaign;
  const is_prod = process.env.NODE_ENV == "production";
  return (
    <>
      <Seo
        title={campaign.title}
        description={campaign.description}
        is_prod={is_prod}
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/campaign/${campaign.id}/${campaign.slug}`}
        image={campaign.banner}
      />
      <section className="min-h-screen w-full">
        <div className="mx-auto mt-(--header-height) max-w-6xl space-y-3 pb-4">
          <CampaignProducts campaign_id={campaign_id} />
        </div>
      </section>
    </>
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
export const getServerSideProps = (async ({ params, req }) => {
  if (!params) {
    return { notFound: true };
  }

  const cookie = req.headers.cookie ?? "";
  const campaign_id = Number(params.campaign_id);
  const query_client = new QueryClient();
  await Promise.all([
    prefetchCommonData(query_client, cookie),
    query_client.prefetchQuery({
      queryKey: ["campaigns"],
      queryFn: () => getCampaigns(),
    }),
  ]);
  const dehydratedState = dehydrate(query_client);
  return {
    props: {
      dehydratedState,
      campaign_id,
    },
  };
}) satisfies GetServerSideProps<IProps, IParams>;
