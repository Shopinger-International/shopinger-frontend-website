// react query
import { useMutation } from "@tanstack/react-query";

// helpers
import axios from "axios";

type IResponse = {
  review_title: string;
  review_description: string;
};

type IRequestPayload = {
  rating: number;
  product_title: string;
  product_description: string;
};

const useReviewGeneratorMutation = () => {
  return useMutation<IResponse, Error, IRequestPayload>({
    mutationKey: ["user-login-and-register-with-otp"],
    async mutationFn({ rating, product_title, product_description }) {
      const { data } = await axios.post<IResponse>("/api/review", {
        rating,
        title: product_title,
        description: product_description,
      });
      return data;
    },
  });
};

export default useReviewGeneratorMutation;
