import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";

// types
import type { ICart } from "@/types/cart";

// helpers
import Axios from "@/lib/axios/private.lib";

export type IResponse = ICart & {
  expires_at: string;
  intent_id: string;
  type: "buy_now";
};

export const getCheckoutIntent = async (intent_id: string, cookie?: string) => {
  try {
    const response = await Axios.get<IResponse>(
      `/checkout/intent/${intent_id}`,
      {
        headers: cookie
          ? {
              cookie,
            }
          : {},
      },
    );
    return response;
  } catch (error) {
    console.log("value of error",error);
    if (error instanceof AxiosError) {
      throw error;
    }
    throw new Error("Unexpected error occurred"); // React Query will catch it
  }
};

const useCheckoutIntent = (intent_id: string) => {
  return useQuery({
    queryKey: ["buy-intent", intent_id],
    async queryFn() {
      const { data } = await getCheckoutIntent(intent_id);
      return data;
    },
  });
};

export default useCheckoutIntent;
