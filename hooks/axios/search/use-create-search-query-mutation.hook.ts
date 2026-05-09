import { useMutation } from "@tanstack/react-query";

// helpers
import webAxios from "@/lib/axios/web.lib";

type IRequest = {
  object_id: string;
  query: string;
  main_category: string;
  sub_category: string;
  sub_sub_category: string;
};

type IResponse = {};
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
