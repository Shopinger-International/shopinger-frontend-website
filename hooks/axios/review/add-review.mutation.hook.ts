// react query
import { useMutation } from "@tanstack/react-query";

// helpers
import Axios from "@/lib/axios/private.lib";

type IResponse = {
  success: boolean;
  message: string;
  data: any;
};

type IRequestPayload = {
  product_id: number;
  variant_id: number;
  order_item_id: number;
  rating: number;
  title: string;
  comment: string;
};

const useAddReviewMutation = () => {
  return useMutation<IResponse, Error, IRequestPayload>({
    async mutationFn(payload) {
      const { data } = await Axios.post<IResponse>("/add-review", payload);
      return data;
    },
  });
};

export default useAddReviewMutation;
