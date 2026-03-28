import Axios from "@/lib/axios/private.lib";

// types
import type { AxiosError } from "axios";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// helpers
import { enqueueSnackbar } from "notistack";

type IResponse = {
  success: boolean;
  message: string;
};
type IErrorResponse = {
  message: string;
  success?: boolean;
};

const useDeleteAddressMutation = () => {
  const query_client = useQueryClient();
  return useMutation<
    IResponse,
    AxiosError<IErrorResponse>,
    {
      address_id: number;
    }
  >({
    async mutationFn({ address_id }) {
      const { data } = await Axios.delete<IResponse>(
        `/delete-user-address/${address_id}`,
      );
      return data;
    },
    onSuccess(data) {
      query_client.invalidateQueries({
        queryKey: ["user-addresses"],
      });
      query_client.invalidateQueries({
        queryKey: ["user-details"],
      });
      enqueueSnackbar(data.message, {
        key: `delete-address-success-${Date.now()}`,
        variant: "success",
      });
    },
    onError(error) {
      const message = error.response?.data?.message || "Something went wrong";

      enqueueSnackbar(message, {
        key: `delete-address-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};
export default useDeleteAddressMutation;
