import Axios from "@/lib/axios/private.lib";

// types
import type { IAddress } from "@/types/address";
import type { AxiosError } from "axios";

// react query
import { useQuery } from "@tanstack/react-query";

type IResponse = {
  data: IAddress[];
  success: boolean;
};

const useUserAddresses = () => {
  return useQuery<IAddress[], AxiosError>({
    queryKey: ["user-addresses"],
    async queryFn() {
      const { data } = await Axios.get<IResponse>("/get-user-addresses");
      return data.data;
    },
    select(data) {
      return data.map((item) => ({
        ...item,
        delivery_instructions: item.delivery_instructions ?? "",
      }));
    },
  });
};
export default useUserAddresses;
