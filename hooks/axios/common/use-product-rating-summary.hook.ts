import { useQuery } from "@tanstack/react-query";
import Axios from "@/lib/axios/private.lib";

interface IProductRatingSummaryResponse {
  average_rating: number;
  total_reviews: number;
  rating_breakdown: {
    [key: string]: number;
  };
}

const getProductRatingSummary = async (
  product_id: number | string,
): Promise<IProductRatingSummaryResponse> => {
  const { data } = await Axios.get<{
    success: boolean;
    data: IProductRatingSummaryResponse;
  }>(`/get-product-rating-summary/${product_id}`);

  return data.data;
};

const useProductRatingSummary = ({
  product_id,
  enabled,
}: {
  product_id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["product-rating-summary", product_id],
    queryFn: () => getProductRatingSummary(product_id!),
    enabled: !!product_id && enabled,
  });
};

export default useProductRatingSummary;
