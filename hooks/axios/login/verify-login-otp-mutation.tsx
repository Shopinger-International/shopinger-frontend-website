import { useMutation } from "@tanstack/react-query";

// lib
import publicAxios from "@/lib/axios/public.lib";

// helpers
import { enqueueSnackbar } from "notistack";

interface VerifyOtpPayload {
  mobile: string;
  otp: string;
}

interface VerifyOtpResponse {
  token?: string;
  user?: any; // replace with IUser if you have it
  message?: string;
}

const useVerifyLoginOtp = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationKey: ["verify-login-otp"],
    mutationFn: async ({ mobile, otp }) => {
      const res = await publicAxios.post<VerifyOtpResponse>(
        `/user-verify-login-otp`,
        new URLSearchParams({ mobile, otp }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      return res.data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "user-verify-login-otp-success",
        variant:"success"
      });
    },

    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "user-verify-login-otp-error",
        variant:"error"
      });
    },
  });
};

export default useVerifyLoginOtp;
