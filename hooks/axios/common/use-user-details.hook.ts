// react query
import { useQuery } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type IUser from "@/types/user";

// lib
import Axios from "@/lib/axios/private.lib";

const useUserDetails = () => {
  return useQuery<IUser, AxiosError>({
    queryKey: ["user-details"],
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 4,
    async queryFn() {
      const { data } = await Axios.get<{
        message: string;
        data: any;
        success: boolean;
      }>("/get-user-details");
      return data.data;
    },
  });
};

export default useUserDetails;
