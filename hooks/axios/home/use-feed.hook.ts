// types
import type { ICategoryLevel } from "@/types/campaign";

// lib
import Axios from "@/lib/axios/private.lib";

// hooks
import { useQuery } from "@tanstack/react-query";

export type IProductRecommendation = {
  product_id: number;
  variant_id: number;
  title: string;
  media_url: string;
};

export type ICategoryRecommendation = {
  category_name: string;
  category_type: ICategoryLevel;
  main_category_slug: string;
  sub_category_slug?: string;
  sub_sub_category_slug?: string;
  products: Array<IProductRecommendation>;
};
export type IResponse = {
  success: boolean;
  data: {
    product_recommendations: Array<IProductRecommendation>;
    continue_shopping_recommendations: Array<IProductRecommendation>;
    buy_again_recommendations: Array<IProductRecommendation>;
    trending_product_recommendations: Array<IProductRecommendation>;
    new_arrivals: Array<IProductRecommendation>;
    best_seller_products: Array<IProductRecommendation>;
    deals_of_the_day: Array<
      IProductRecommendation & {
        discount: number;
      }
    >;
    category_recommendations: Array<ICategoryRecommendation>;
  };
};
const useFeed = () => {
  return useQuery<IResponse["data"]>({
    queryKey: ["feed"],
    async queryFn() {
      const { data } = await Axios.get<IResponse>("/home-feed");
      return data.data;
    },
  });
};
export default useFeed;
