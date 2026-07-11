// api/product.ts
import Axios from "@/lib/axios/private.lib";

// react query
import { useQuery } from "@tanstack/react-query";

export type ProductAvailabilityResponse = {
  success: boolean;
  data: {
    product_id: number;
    variant_id: number;
    stock: number;
    reserved_stock: number;
    available_stock: number;
    in_stock: boolean;
  };
};

export const getProductAvailability = async (
  product_id: number,
  variant_id: number,
): Promise<ProductAvailabilityResponse["data"]> => {
  const { data } = await Axios.get<ProductAvailabilityResponse>(
    "/get-product-availability",
    {
      params: {
        product_id,
        variant_id,
      },
    },
  );

  return data.data;
};
export const useProductAvailability = (
  product_id?: number,
  variant_id?: number,
) => {
  return useQuery({
    queryKey: ["product-availability", product_id, variant_id],
    queryFn: () => getProductAvailability(product_id!, variant_id!),
    enabled: !!product_id && !!variant_id,
    staleTime: 30 * 1000, // 30s cache (adjust as needed)
  });
};
