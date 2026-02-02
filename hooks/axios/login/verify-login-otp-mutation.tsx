import { useMutation } from "@tanstack/react-query";
import publicAxios from "@/lib/axios/public.lib";

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
  });
};

export default useVerifyLoginOtp;
