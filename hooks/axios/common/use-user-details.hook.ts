// react query
import { useQuery } from "@tanstack/react-query";

// types
import { AxiosError } from "axios";
import type IUser from "@/types/user";

// lib
import Axios from "@/lib/axios/private.lib";

/**
 * Accepting cookie because on ssr no cookies
 * are passed with credientials
 */
export const getUser = async (cookie?: string) => {
  try {
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
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Unexpected error occurred");
  }
};

const useUserDetails = () => {
  return useQuery<IUser | null, AxiosError>({
    queryKey: ["user-details"],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      try {
        return await getUser();
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return null; // only here
        }
        throw error;
      }
    },
  });
};

export default useUserDetails;
