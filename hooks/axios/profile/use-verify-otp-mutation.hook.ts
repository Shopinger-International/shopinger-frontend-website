import { useMutation } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IRequest = {
  otp: string;
};

type IResponse = {
  success: boolean;
  message: string;
};

export const verifyOtpForUserContact = async (
  payload: IRequest,
): Promise<IResponse> => {
  const { data } = await Axios.post("/verify-otp-for-user-contact", payload);

  return data;
};

const useVerifyOtpMutation = () => {
  return useMutation({
    mutationFn: verifyOtpForUserContact,
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "verify-otp-success",
        variant: "success",
      });
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "verify-otp-error",
        variant: "error",
      });
    },
  });
};

export default useVerifyOtpMutation;
