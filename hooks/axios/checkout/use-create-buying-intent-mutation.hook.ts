import { useMutation } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IRequestPayload = {
  product_id: number;
  variant_id: number;
  quantity: 1;
};

type IResponse = {
  success: boolean;
  intent_id: string;
  expires_in: string;
  message?: string;
};

const useCreateBuyingIntentMutation = () => {
  return useMutation<IResponse, Error, IRequestPayload>({
    async mutationFn(payload) {
      const { data } = await Axios.post<IResponse>(
        "/checkout/buy-now",
        payload,
      );
      return data;
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: `create-buying-intent-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};
export default useCreateBuyingIntentMutation;
