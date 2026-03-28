import Axios from "@/lib/axios/private.lib";

// types
import type { IFormAddressType } from "@/components/manage-address/add-address-modal/add-address-modal.component";
import type { IAddress } from "@/types/address";
import type { AxiosError } from "axios";

// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// helpers
import { enqueueSnackbar } from "notistack";

type IResponse = {
  data: IAddress;
  success: boolean;
  message: string;
};
type IErrorResponse = {
  message: string;
  success?: boolean;
};

const useUpdateAddressMutation = () => {
  const query_client = useQueryClient();
  return useMutation<
    IResponse,
    AxiosError<IErrorResponse>,
    {
      address_id: number;
      payload: IFormAddressType;
    }
  >({
    async mutationFn({ address_id, payload }) {
      const { data } = await Axios.put<IResponse>(
        `/update-user-address/${address_id}`,
        payload,
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
        key: `address-updated-success-${Date.now()}`,
        variant: "success",
      });
    },
    onError(error) {
      const message = error.response?.data?.message || "Something went wrong";

      enqueueSnackbar(message, {
        key: `address-updated-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};
export default useUpdateAddressMutation;
