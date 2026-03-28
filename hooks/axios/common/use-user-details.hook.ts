// react query
import { useQuery } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type IUser from "@/types/user";

// lib
import Axios from "@/lib/axios/private.lib";

/**
 * Accepting cookie because on ssr no cookies
 * are passed with credientials
 */
export const getUser = async (cookie?: string) => {
  const { data } = await Axios.get<{
    data: IUser;
    success: boolean;
    message: string;
  }>(`/get-user-details`, {
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });

  return data.data;
};

const useUserDetails = () => {
  return useQuery<IUser, AxiosError>({
    queryKey: ["user-details"],
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 4,
    async queryFn() {
      const user_details = await getUser();
      return user_details;
    },
  });
};

export default useUserDetails;
