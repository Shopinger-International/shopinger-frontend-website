import { useMutation, useQueryClient } from "@tanstack/react-query";

// types
import type { AxiosError } from "axios";
import type IUser from "@/types/user";

// lib
import publicAxios from "@/lib/axios/public.lib";

// helpers
import { enqueueSnackbar } from "notistack";

interface VerifyOtpPayload {
  identifier: string;
  otp: string;
  country_code: string | undefined;
}

interface VerifyOtpResponse {
  token: string;
  user: IUser; // replace with IUser if you have it
  success: boolean;
  message: string;
}

const useVerifyLoginOtp = () => {
  const query_client = useQueryClient();
  return useMutation<
    VerifyOtpResponse,
    AxiosError<{
      message: string;
    }>,
    VerifyOtpPayload
  >({
    mutationKey: ["verify-login-otp"],
    mutationFn: async ({ identifier, otp, country_code }) => {
      const res = await publicAxios.post<VerifyOtpResponse>(
        `/user-verify-login-otp`,
        new URLSearchParams({
          identifier,
          otp,
          ...(country_code ? { country_code } : {}),
        }),
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return res.data;
    },
    onSuccess(response) {
      query_client.invalidateQueries({
        queryKey: ["user-details"],
      });

      query_client.invalidateQueries({
        queryKey: ["user-addresses"],
      });

      query_client.invalidateQueries({
        queryKey: ["carts"],
      });
      enqueueSnackbar(response.message, {
        key: "user-verify-login-otp-success",
        variant: "success",
      });
    },

    onError(error) {
      enqueueSnackbar(error.response?.data?.message ?? "Something went wrong", {
        key: "user-verify-login-otp-error",
        variant: "error",
      });
    },
  });
};

export default useVerifyLoginOtp;
