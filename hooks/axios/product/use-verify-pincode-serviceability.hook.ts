import { useMutation } from "@tanstack/react-query";

// lib
import webAxios from "@/lib/axios/web.lib";

interface VerifyOtpPayload {
  pin_code: string;
}

interface VerifyOtpResponse {
  message?: string;
}

const useVerifyPincodeServiceability = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationKey: ["verify-login-otp"],
    mutationFn: async ({ pin_code }) => {
      const res = await webAxios.get<VerifyOtpResponse>(
        `/check-serviceable-pincode`,
        {
          params: { pin_code },
        },
      );

      return res.data;
    },
  });
};

export default useVerifyPincodeServiceability;
