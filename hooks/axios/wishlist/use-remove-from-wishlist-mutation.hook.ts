import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// type
import type { IResponseType } from "../categories/use-get-category-product.hook";

// lib
import Axios from "@/lib/axios/private.lib";

// helpers
import { enqueueSnackbar } from "notistack";

type IRequestPayload = {
  variant_id: number;
};

type IResponse = {
  success: boolean;
  message: string;
};

const useRemoveFromWishlistMutation = () => {
  const query_client = useQueryClient();
  return useMutation<IResponse, Error, IRequestPayload>({
    async mutationFn({ variant_id }) {
      const { data } = await Axios.delete<IResponse>(`/wishlist/${variant_id}`);
      return data;
    },

    onSuccess(data, { variant_id }) {
      query_client.setQueriesData(
        {
          queryKey: ["products-by-category"],
        },
        (old_data: any) => {
          if (!old_data) return old_data;

          return {
            ...old_data,
            pages: old_data.pages.map((page: IResponseType) => ({
              ...page,
              products: page.products.map((product) => ({
                ...product,
                ...(product.variants[0].id == variant_id
                  ? {
                      is_wishlisted: false,
                    }
                  : {}),
              })),
            })),
          };
        },
      );

      query_client.setQueriesData(
        {
          queryKey: ["campaign-product"],
        },
        (old_data: any) => {
          if (!old_data) return old_data;

          return {
            ...old_data,
            pages: old_data.pages.map((page: IResponseType) => ({
              ...page,
              products: page.products.map((product) => ({
                ...product,
                ...(product.variants[0].id == variant_id
                  ? {
                      is_wishlisted: false,
                    }
                  : {}),
              })),
            })),
          };
        },
      );

      query_client.setQueriesData(
        {
          queryKey: ["section-products"],
        },
        (old_data: any) => {
          if (!old_data) return old_data;

          return {
            ...old_data,
            pages: old_data.pages.map((page: IResponseType) => ({
              ...page,
              products: page.products.map((product) => ({
                ...product,
                ...(product.variants[0].id == variant_id
                  ? {
                      is_wishlisted: false,
                    }
                  : {}),
              })),
            })),
          };
        },
      );
      enqueueSnackbar(data.message, {
        key: `remove-from-wishlist-${Date.now()}`,
        variant: "success",
      });
    },

    onError(error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data?.message ?? "Something went wrong",
          {
            key: `remove-from-wishlist-error-${Date.now()}`,
            variant: "error",
          },
        );
      } else {
        enqueueSnackbar("Unexpected error occurred", {
          key: `remove-from-wishlist-error-${Date.now()}`,
          variant: "error",
        });
      }
    },
  });
};

export default useRemoveFromWishlistMutation;
