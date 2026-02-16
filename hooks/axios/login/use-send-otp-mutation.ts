// react query
import { useMutation } from "@tanstack/react-query";

// lib
import publicAxios from "@/lib/axios/public.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IResponse = {
  is_success: boolean;
  message: string;
};

type IRequestPayload = {
  identifier: string;
};

const useSendOTPMutation = () => {
  return useMutation<IResponse, Error, IRequestPayload>({
    mutationKey: ["user-login-and-register-with-otp"],
    async mutationFn({ identifier }) {
      const { data } = await publicAxios.post<IResponse>(
        "/user-login-and-register-with-otp",
        {
          identifier,
        },
      );
      return data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "user-login-and-register-with-otp-success",
        variant: "success",
      });
    },

    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "user-login-and-register-with-otp-error",
        variant: "error",
      });
    },
  });
};

export default useSendOTPMutation;
