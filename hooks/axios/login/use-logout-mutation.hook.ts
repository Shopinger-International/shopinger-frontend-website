// react query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IResponse = {
  is_success: boolean;
  message: string;
};

const useLogoutMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, Error>({
    async mutationFn() {
      const { data } = await Axios.post<IResponse>(
        "/user-logout",
        {},
        {
          withCredentials: true,
        },
      );
      return data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: "user-logout-success",
        variant: "success",
      });
      query_client.invalidateQueries();
    },

    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "user-logout-error",
        variant: "error",
      });
    },
  });
};

export default useLogoutMutation;
