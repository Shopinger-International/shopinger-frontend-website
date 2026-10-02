import { useQuery } from "@tanstack/react-query";
import Axios from "@/lib/axios/private.lib";

type IResponse = {
  success: boolean;
  is_wishlisted: boolean;
};

type IParams = {
  variant_id: number;
  enabled?: boolean;
};

const useIsWishlisted = ({ variant_id, enabled = true }: IParams) => {
  return useQuery({
    queryKey: ["is-wishlisted", variant_id],

    queryFn: async () => {
      const { data } = await Axios.get<IResponse>(`/wishlist/${variant_id}`);

      return data;
    },

    enabled: !!variant_id && enabled,
    staleTime: 5 * 60 * 1000,
  });
};

export default useIsWishlisted;
