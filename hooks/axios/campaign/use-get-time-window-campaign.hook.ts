import { useQuery } from "@tanstack/react-query";

// types
import type ICampaign from "@/types/campaign";

// helpers
import webAxios from "@/lib/axios/web.lib";

type IResponse = {
  data: ICampaign;
};

const useGetTimeWindowCampaign = () => {
  return useQuery<IResponse["data"]>({
    queryKey: ["time-window-sale"],
    async queryFn() {
      const { data } = await webAxios<IResponse>("/get-time-window-campaign");
      return data.data;
    },
  });
};

export default useGetTimeWindowCampaign;
