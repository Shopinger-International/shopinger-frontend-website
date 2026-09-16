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
    queryKey: ["campaigns", display_scope, category_slug],
    async queryFn() {
      return getCampaigns({ display_scope, category_slug });
    },
  });
};

export default useAllCamapigns;
