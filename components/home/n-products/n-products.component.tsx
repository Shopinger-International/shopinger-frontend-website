import { useRef, useEffect, useContext, useState } from "react";
// types
import type { IResponseType } from "@/hooks/axios/home/use-n-products.hook";

// hooks
import useNProducts from "@/hooks/axios/home/use-n-products.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";

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
  const { openModal: openLoginModal } = useLoginModalContext();
  const {
    data,
    isPending: isProductPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useNProducts({
    limit: 20,
  });
  const [has_started_loading_more, setHasStartedLoadingMore] = useState(false);
  const show_view_more = !has_started_loading_more && hasNextPage;

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
    if (!has_started_loading_more || !load_more_ref.current) return;

    observer_ref.current?.disconnect();

    observer_ref.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "400px",
        threshold: 0,
      },
    );

    observer_ref.current.observe(load_more_ref.current);

    return () => observer_ref.current?.disconnect();
  }, [
    has_started_loading_more,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    updateShowFooter?.(
      !has_started_loading_more || (!hasNextPage && !isProductPending),
    );
  }, [has_started_loading_more, hasNextPage, isProductPending]);
  return (
    <div className="max-w-8xl mx-auto w-full space-y-4 px-4 pb-4">
      <h2 className="text-lg font-semibold text-orange-500 md:text-xl">
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
      {show_view_more ? (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setHasStartedLoadingMore(true);
              fetchNextPage();
            }}
            disabled={isFetchingNextPage}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isFetchingNextPage ? "Loading..." : "View More"}
          </button>

          <button
            type="button"
            onClick={() => openLoginModal({})}
            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-orange-300"
          >
            Login
          </button>
        </div>
      ) : (
        hasNextPage && <div ref={load_more_ref} className="h-1" />
      )}
    </div>
  );
};
export default NProducts;
