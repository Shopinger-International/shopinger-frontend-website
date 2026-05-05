import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
// types
import type IProduct from "@/types/product";

// helpers
import webAxios from "@/lib/axios/web.lib";

const getRelatedProducts = async (
  product_id: number,
): Promise<{
  related_products: IProduct[];
}> => {
  try {
    const {
      data: { related_products },
    } = await webAxios.get<{
      success: boolean;
      related_products: IProduct[];
    }>(`/get-related-products/${product_id}`);
    return {
      related_products,
    };
  } catch (err) {
    if (err instanceof AxiosError) {
      throw err;
    }
    throw new Error("Unexpected error occurred");
  }
};

const useRelatedProducts = (product_id: number) => {
  return useQuery<IProduct[]>({
    queryKey: ["related-products", product_id],
    async queryFn() {
      const response = await getRelatedProducts(product_id);
      return response.related_products;
    },
  });
};

export default useRelatedProducts;
