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

// 4. Your final, clean type
const useAllCamapigns = () => {
  return useQuery({
    queryKey: ["campaigns"],
    async queryFn() {
      const { data } = await webAxios.get<IResponse>(`/get-campaigns`, {
        params: {
          is_active: true,
        },
      });
      return data.data;
    },
  });
};

export default useAllCamapigns;
