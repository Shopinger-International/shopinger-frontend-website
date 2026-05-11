import { useMutation } from "@tanstack/react-query";
// types
import type {
  ICategory,
  ISubCategory,
  ISubSubCategory,
} from "@/types/categories";

// helpers
import webAxios from "@/lib/axios/web.lib";

type IRequest = {
  object_id: string;
  query: string;
};

type IResponse = {
  main_category: ICategory;
  sub_category: ISubCategory;
  sub_sub_category: ISubSubCategory;
  success: boolean;
};
const useCreateSearchQueryMutation = () => {
  return useMutation<IResponse, Error, IRequest>({
    async mutationFn(payload) {
      const { data } = await webAxios.post<IResponse>(
        "/create-search-query",
        payload,
      );
      return data;
    },
  });
};
export default useCreateSearchQueryMutation;
