import { useMutation, useQueryClient } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IRequestPayload = {
  intent_id: string;
  variant_id: number;
  quantity: number;
};

type IResponse = {
  success: boolean;
  message: string;
};

const useUpdateIntentQuantityMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, Error, IRequestPayload>({
    async mutationFn({ intent_id, ...payload }) {
      const { data } = await Axios.patch<IResponse>(
        `/checkout/intent/update-quantity/${intent_id}`,
        payload,
      );
      return data;
    },
    onSuccess(response, payload) {
      query_client.invalidateQueries({
        queryKey: ["buy-intent", payload.intent_id],
      });
      enqueueSnackbar(response.message, {
        key: `update-intent-quantity-success-${Date.now()}`,
        variant: "success",
      });
    },
    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: `update-intent-quantity-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};
export default useUpdateIntentQuantityMutation;
