import Axios from "@/lib/axios/private.lib";

// types
import type { IAddress } from "@/types/address";
import type { AxiosError } from "axios";

// react query
import { useQuery } from "@tanstack/react-query";

export type IResponse = {
  data: Array<IAddress>;
  success: boolean;
};

export const getUserAddresses = async (cookie?: string) => {
  const { data } = await Axios.get<IResponse>(`/get-user-addresses`, {
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });

  return data.data;
};

const useUserAddresses = () => {
  return useQuery<IAddress[], AxiosError>({
    queryKey: ["user-addresses"],
    async queryFn() {
      const user_addresses = await getUserAddresses();
      return user_addresses;
    },
    staleTime: 1000 * 60 * 5,
    select(data) {
      return data.map((item) => ({
        ...item,
        delivery_instructions: item.delivery_instructions ?? "",
      }));
    },
  });
};
export default useUserAddresses;
