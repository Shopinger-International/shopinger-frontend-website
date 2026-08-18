import { useRef, useEffect, useContext } from "react";
// types
import type { IResponseType } from "@/hooks/axios/home/use-n-products.hook";

// hooks
import useNProducts from "@/hooks/axios/home/use-n-products.hook";

// local components
import ProductCard from "@/components/categories/product-card/product-card.component";
import ProductCardSkeleton from "@/components/categories/product-card/product-card-skeleton.component";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import { isNewProduct } from "@/helpers/product.helper";

// context
import { FooterStateContext } from "@/context";

const NProducts = () => {
  const { updateShow: updateShowFooter } = useContext(FooterStateContext);
  const {
    data,
    isPending: isProductPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNProducts({
    limit: 20,
  });

  const load_more_ref = useRef<HTMLDivElement | null>(null);
  const observer_ref = useRef<IntersectionObserver | null>(null);
  const products = data?.pages.reduce<IResponseType["products"]>(
    (acc, { products }) => {
      return [...acc, ...products];
    },
    [],
  );

  const formatted_products = products?.map((product) => {
    const product_slug = generateSlug(product.title);
    const is_new = isNewProduct(product.created_at);
    const product_reviews_link = `/${product_slug}/p/${product.product_id}/reviews`;
    return {
      ...product,
      src: `/${product_slug}/p/${product.product_id}/${product.variant_id}`,
      product_reviews_link,
      is_new,
    };
  });

  useEffect(() => {
    if (!load_more_ref.current) return;

    if (observer_ref.current) observer_ref.current.disconnect();

    observer_ref.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0];

        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "400px",
        threshold: 0,
      },
    );

    observer_ref.current.observe(load_more_ref.current);

    return () => observer_ref.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    updateShowFooter?.(!hasNextPage && !isProductPending);
  }, [hasNextPage, isProductPending]);
  return (
    <div className="max-w-8xl mx-auto w-full space-y-4 px-4 pb-4">
      <h2 className="text-lg font-semibold text-gray-900 md:text-xl">
        Personalized Products For you
      </h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
        {isProductPending
          ? Array.from({ length: 20 }).map((_, i) => (
              <ProductCardSkeleton key={`initial-skeleton-${i}`} />
            ))
          : formatted_products?.map((product, index) =>
              product ? (
                <ProductCard
                  {...product}
                  index={index}
                  key={`category-product-${product?.variant_id}`}
                />
              ) : null,
            )}

        {/* infinite scroll loading */}
        {!isProductPending &&
          isFetchingNextPage &&
          Array.from({ length: 20 }).map((_, i) => (
            <ProductCardSkeleton key={`next-page-skeleton-${i}`} />
          ))}
      </div>

      {/* observer */}
      {hasNextPage && <div ref={load_more_ref} className="h-1" />}
    </div>
  );
};
export default NProducts;
