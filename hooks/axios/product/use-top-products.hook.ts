import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
// types
import type IProduct from "@/types/product";

// helpers
import webAxios from "@/lib/axios/web.lib";
import IVariant from "@/types/variant";

const getTopProducts = async (
  product_id: number,
): Promise<{
  top_products: Array<
    Omit<IProduct, "variants"> & {
      avg_rating: number;
      bought_last_month: number;
      variants: Array<
        IVariant & {
          _count: {
            wishlists: number;
          };
        }
      >;
    }
  >;
}> => {
  try {
    const {
      data: { top_products },
    } = await webAxios.get<{
      success: boolean;
      top_products: Array<
        Omit<IProduct, "variants"> & {
          avg_rating: number;
          bought_last_month: number;
          variants: Array<
            IVariant & {
              _count: {
                wishlists: number;
              };
            }
          >;
        }
      >;
    }>(`/get-top-products/${product_id}`);
    return {
      top_products,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err;
    }
    throw new Error("Unexpected error occurred");
  }
};

const useTopProducts = (product_id: number) => {
  return useQuery<
    Array<
      Omit<IProduct, "variants"> & {
        avg_rating: number;
        bought_last_month: number;
        variants: Array<
          IVariant & {
            _count: {
              wishlists: number;
            };
          }
        >;
      }
    >
  >({
    queryKey: ["top-products", product_id],
    async queryFn() {
      const response = await getTopProducts(product_id);
      return response.top_products;
    },
  });
};

export default useTopProducts;
