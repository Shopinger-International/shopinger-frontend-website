// types
import type { QueryClient } from "@tanstack/react-query";

import { getUser } from "@/hooks/axios/common/use-user-details.hook";
import { getCart } from "@/hooks/axios/cart/use-cart.hook";
import { getCategory } from "@/hooks/axios/common/use-categories";

// lib/prefetchCommonData.ts
export const prefetchCommonData = async (
  queryClient: QueryClient,
  cookie: string,
) => {
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["user-details"],
      queryFn: () => getUser(cookie),
    }),
    queryClient.prefetchQuery({
      queryKey: ["carts"],
      queryFn: () => getCart(cookie),
    }),
    queryClient.prefetchQuery({
      queryKey: ["categories-list", true],
      queryFn: () => getCategory(true, "sub"),
    }),
  ]);
};
