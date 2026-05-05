import { useMutation } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IRequest = {
  new_identifier: string;
  country_code?: number;
};

type IResponse = {
  success: boolean;
  message: string;
};

const sendOtpForUpdatingUserContact = async (
  payload: IRequest,
): Promise<IResponse> => {
  const { data } = await Axios.post(
    "/send-otp-for-updating-user-contact",
    payload,
  );

  return data;
};

const useSendOtpMutation = () => {
  return useMutation({
    mutationFn: sendOtpForUpdatingUserContact,
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "send-otp-success",
        variant: "success",
      });
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "send-otp-error",
        variant: "error",
      });
    },
  });
};
export default useSendOtpMutation;
