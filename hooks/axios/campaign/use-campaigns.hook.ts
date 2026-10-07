import { useQuery } from "@tanstack/react-query";

// types
import ICampaign from "@/types/campaign";

// helpers
import webAxios from "@/lib/axios/web.lib";

export type IResponse = {
  success: boolean;
  data: Array<
    ICampaign & {
      has_product: boolean;
      has_category: boolean;
    }
  >;
  error?: string;
};

export const campaignsQueryKey = ({
  display_scope,
  category_slug,
}: {
  display_scope?: string;
  category_slug?: string;
}) => ["campaigns", display_scope ?? null, category_slug ?? null];

export const getCampaigns = async ({
  display_scope,
  category_slug,
}: {
  display_scope?: string;
  category_slug?: string;
}) => {
  const { data } = await webAxios.get<IResponse>(`/get-campaigns`, {
    params: {
      is_active: true,
      status: "active",
      display_scope,
      category_slug,
    },
  });
  return data.data;
};

const useAllCamapigns = ({
  display_scope = "HOME",
  category_slug,
}: {
  display_scope?: string;
  category_slug?: string;
}) => {
  return useQuery({
    queryKey: campaignsQueryKey({
      display_scope,
      category_slug,
    }),
    queryFn: () =>
      getCampaigns({
        display_scope,
        category_slug,
      }),
  });
};

export default useAllCamapigns;
