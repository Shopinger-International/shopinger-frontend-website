import { useInfiniteQuery } from "@tanstack/react-query";
import Axios from "@/lib/axios/private.lib";

// types
import type IProduct from "@/types/product";
import type IVariant from "@/types/variant";
import type { ISort } from "@/components/categories/category-products.component";

type CategoryType = "main" | "sub" | "sub_sub";

type GetProductsByCategoryParams = {
  slug?: string;
  category_type?: CategoryType;
  limit?: number;
  sort?: ISort;
  min_price?: number;
  max_price?: number;
  min_rating?: number;
  brands?: Array<string>;
  filters?: Record<string, string[]>;
  search?: string;
};

export type IResponseType = {
  message: string;
  pagination: {
    limit: number;
    page: number;
    total: number;
    total_pages: number;
  };
  products: Array<
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
};

const useGetCategoryProducts = ({
  slug,
  category_type,
  limit = 12,
  sort = "latest",
  min_price,
  max_price,
  min_rating,
  brands,
  filters,
  search,
}: GetProductsByCategoryParams) => {
  return useInfiniteQuery({
    queryKey: [
      "products-by-category",
      slug,
      category_type,
      limit,
      sort,
      min_price,
      max_price,
      min_rating,
      brands,
      filters,
      search,
    ],

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const response = await Axios.get<IResponseType>(
        "/get-products-by-category-slug",
        {
          params: {
            slug,
            category_type,
            page: pageParam,
            limit,
            sort,
            min_price,
            max_price,
            min_rating,
            brands,
            filters: filters ? JSON.stringify(filters) : undefined,
            search,
          },

          withCredentials: true,
        },
      );

      return response.data;
    },

    getNextPageParam: (lastPage) => {
      const currentPage = lastPage?.pagination?.page;
      const totalPages = lastPage?.pagination?.total_pages;

      if (currentPage < totalPages) {
        return currentPage + 1;
      }

      return undefined;
    },
  });
};

export default useGetCategoryProducts;
