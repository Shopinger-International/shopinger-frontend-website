import { useMutation } from "@tanstack/react-query";
// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

// hooks
import useLogoutMutation from "../login/use-logout-mutation.hook";

type IResponse = {
  success: boolean;
  message: string;
};

export const softDeleteUser = async (): Promise<IResponse> => {
  const { data } = await Axios.delete("/soft-delete-user");

  return data;
};

const useSoftDeleteUser = () => {
  const logout_mutation = useLogoutMutation();
  return useMutation({
    mutationFn: softDeleteUser,
    onSuccess: (response) => {
      logout_mutation.mutate();
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
