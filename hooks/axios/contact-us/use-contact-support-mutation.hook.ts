import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
// types
import type { IContactUsFormData } from "@/components/contact-us/contact-us-form.component";

// lib
import webAxios from "@/lib/axios/web.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IResponse = {
  success: boolean;
  message: string;
  error: any;
};
const useContactSupportMutation = () => {
  return useMutation<IResponse, Error, IContactUsFormData>({
    async mutationFn(payload) {
      const { data } = await webAxios.post<IResponse>(
        "/contact-support",
        payload,
      );
      return data;
    },
    onSuccess(response) {
      enqueueSnackbar(response.message, {
        key: `contact-support-success-${Date.now()}`,
        variant: "success",
      });
    },
    onError(error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data?.message ?? "Something went wrong",
          {
            key: `contact-support-error-${Date.now()}`,
            variant: "error",
          },
        );
      } else {
        enqueueSnackbar("Unexpected error occured", {
          key: `contact-support-error-${Date.now()}`,
          variant: "error",
        });
      }
    },
  });
};
export default useContactSupportMutation;
