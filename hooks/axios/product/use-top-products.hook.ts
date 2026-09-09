import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
// types
import type IProduct from "@/types/product";

// helpers
import webAxios from "@/lib/axios/web.lib";

const getRelatedProducts = async (
  product_id: number,
): Promise<{
  top_products: IProduct[];
}> => {
  try {
    const {
      data: { top_products },
    } = await webAxios.get<{
      success: boolean;
      top_products: IProduct[];
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
  return useQuery<IProduct[]>({
    queryKey: ["top-products", product_id],
    async queryFn() {
      const response = await getRelatedProducts(product_id);
      return response.top_products;
    },
  });
};

export default useTopProducts;
