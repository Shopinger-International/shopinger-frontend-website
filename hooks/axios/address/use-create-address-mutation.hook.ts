import Axios from "@/lib/axios/private.lib";

// types
import type { IAddress } from "@/types/address";
import type { IFormAddressType } from "@/components/manage-address/add-address-modal/add-address-modal.component";
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

const useCreateAddressMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, AxiosError<IErrorResponse>, IFormAddressType>({
    async mutationFn(payload) {
      const { data } = await Axios.post<IResponse>(
        "/add-user-address",
        payload,
      );
      return data;
    },
    onSuccess(data) {
      query_client.invalidateQueries({
        queryKey: ["user-addresses"],
      });
      enqueueSnackbar(data.message, {
        key: `address-created-success-${Date.now()}`,
        variant: "success",
      });
    },
    onError(error) {
      const message = error.response?.data?.message || "Something went wrong";

      enqueueSnackbar(message, {
        key: `address-created-error-${Date.now()}`,
        variant: "error",
      });
    },
  });
};
export default useCreateAddressMutation;
