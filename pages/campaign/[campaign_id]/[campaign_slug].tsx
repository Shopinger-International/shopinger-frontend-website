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
import webAxios from "@/lib/axios/web.lib";

// hooks

export const getCampaign = async (campaign_id: number) => {
  try {
    const { data } = await webAxios.get<{
      success: boolean;
      data: ICampaign;
    }>(`/get-campaign/${campaign_id}`);
    return data.data;
  } catch {
    return null;
  }
};

type IParams = {
  campaign_id: string;
  campaign_slug: string;
};

type IProps = {
  dehydratedState: DehydratedState;
  campaign_id: number;
  campaign: ICampaign;
};
const CampaignPage: NextPageWithLayout<IProps> = ({
  campaign_id,
  campaign,
}) => {
  const is_prod = process.env.NODE_ENV == "production";
  if (!campaign) {
    return null;
  }
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
        <h1 className="sr-only">{campaign.title}</h1>
        <p className="sr-only">{campaign.description}</p>
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
  await prefetchCommonData(query_client, cookie);
  const campaign = await getCampaign(campaign_id);
  if (!campaign) {
    return {
      notFound: true,
    };
  }
  const dehydratedState = dehydrate(query_client);
  return {
    props: {
      dehydratedState,
      campaign_id,
      campaign,
    },
  };
}) satisfies GetServerSideProps<IProps, IParams>;
