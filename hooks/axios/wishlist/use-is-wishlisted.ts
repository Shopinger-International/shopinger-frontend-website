import { useQuery } from "@tanstack/react-query";
import Axios from "@/lib/axios/private.lib";

type IResponse = {
  success: boolean;
  is_wishlisted: boolean;
};

type IParams = {
  variant_id: number;
};

const useIsWishlisted = ({ variant_id }: IParams) => {
  return useQuery({
    queryKey: ["is-wishlisted", variant_id],

    queryFn: async () => {
      const { data } = await Axios.get<IResponse>(`/wishlist/${variant_id}`);

      return data;
    },

    enabled: !!variant_id,
  });
};

export default useIsWishlisted;
