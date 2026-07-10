import { useRouter } from "next/router";
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
const useAddToWishlistMutation = () => {
  const router = useRouter();
  const query_client = useQueryClient();
  return useMutation<IResponse, Error, IRequestPayload>({
    async mutationFn({ variant_id }) {
      const { data } = await Axios.post<IResponse>(`/wishlist/${variant_id}`);
      return data;
    },
    onSuccess(data, { variant_id }) {
      query_client.invalidateQueries({
        queryKey: ["is-wishlisted", variant_id],
      });
      query_client.invalidateQueries({
        queryKey: ["wishlist"],
      });
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
                variants: product.variants.map((variant) =>
                  variant.id == variant_id
                    ? {
                        ...variant,
                        _count: {
                          wishlists: 1,
                        },
                      }
                    : variant,
                ),
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
                variants: product.variants.map((variant) =>
                  variant.id == variant_id
                    ? {
                        ...variant,
                        _count: {
                          wishlists: 1,
                        },
                      }
                    : variant,
                ),
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
                variants: product.variants.map((variant) =>
                  variant.id == variant_id
                    ? {
                        ...variant,
                        _count: {
                          wishlists: 1,
                        },
                      }
                    : variant,
                ),
              })),
            })),
          };
        },
      );
      enqueueSnackbar(data.message, {
        key: `add-to-wishlist-${Date.now()}`,
        variant: "success",
        action_label: "View Wishlist",
        onActionClick: () => router.push("/wishlist"),
      });
    },
    onError(error) {
      if (error instanceof AxiosError) {
        enqueueSnackbar(
          error.response?.data?.message ?? "Something went wrong",
          {
            key: `add-to-wishlist-error-${Date.now()}`,
            variant: "error",
          },
        );
      } else {
        console.log("value of err", error);
        enqueueSnackbar("Unexpected error occured", {
          key: `add-to-wishlist-error-${Date.now()}`,
          variant: "error",
        });
      }
    },
  });
};

export default useAddToWishlistMutation;
