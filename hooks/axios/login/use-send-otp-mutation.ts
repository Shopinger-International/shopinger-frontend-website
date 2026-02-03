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
  phone: string;
};

const useSendOTPMutation = () => {
  return useMutation<IResponse, Error, IRequestPayload>({
    mutationKey: ["user-login-and-register-with-otp"],
    async mutationFn({ phone }) {
      const { data } = await publicAxios.post<IResponse>(
        "/user-login-and-register-with-otp",
        {
          phone,
        },
      );
      return data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message);
    },

    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message);
    },
  });
};

export default useSendOTPMutation;
