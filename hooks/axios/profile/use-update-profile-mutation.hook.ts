import { useQueryClient, useMutation } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";
import { enqueueSnackbar } from "notistack";

type IRequest = {
  name: string;
  email: string;
  phone: string;
  gender: "male" | "female" | "other";
  dob: string;
  country_code:number;
};

type IResponse = {
  success: boolean;
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
  };
};

export const updateUserProfile = async (
  payload: IRequest,
): Promise<IResponse> => {
  const { data } = await Axios.patch("/update-user-profile", payload);

  return data;
};

const useUpdateUserProfileMutation = () => {
  const query_client = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (response) => {
      query_client.invalidateQueries({ queryKey: ["user-details"] });

      enqueueSnackbar(response.message, {
        key: "update-profile-success",
        variant: "success",
      });
    },

    onError(error) {
      // @ts-ignore
      enqueueSnackbar(error.response.data.message, {
        key: "update-profile-error",
        variant: "error",
      });
    },
  });
};

export default useUpdateUserProfileMutation;
