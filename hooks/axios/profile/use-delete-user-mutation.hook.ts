import { useMutation, useQueryClient } from "@tanstack/react-query";
// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IResponse = {
  success: boolean;
  message: string;
};

export const softDeleteUser = async (): Promise<IResponse> => {
  const { data } = await Axios.delete("/soft-delete-user");

  return data;
};

const useSoftDeleteUser = () => {
  const query_client = useQueryClient();
  return useMutation({
    mutationFn: softDeleteUser,
    onSuccess: (response) => {
      query_client.resetQueries();
      enqueueSnackbar(response.message, {
        key: "delete-profile-success",
        variant: "success",
      });
    },

    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "delete-profile-error",
        variant: "error",
      });
    },
  });
};
export default useSoftDeleteUser;
