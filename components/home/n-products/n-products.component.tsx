import { useRef, useEffect, useContext, useState } from "react";
// types
import type { IResponseType } from "@/hooks/axios/home/use-n-products.hook";

// hooks
import useNProducts from "@/hooks/axios/home/use-n-products.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// local components
import ProductCard from "@/components/categories/product-card/product-card.component";
import ProductCardSkeleton from "@/components/categories/product-card/product-card-skeleton.component";

// helpers
import { generateSlug } from "@/helpers/product.helper";
import { isNewProduct } from "@/helpers/product.helper";

// context
import { FooterStateContext } from "@/context";

// icons
import { ShoppingBag, ArrowRight } from "lucide-react";

const NProducts = () => {
  const { data: user_details } = useUserDetails();
  const is_logged_in = !!user_details;
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
        <div className="relative mx-auto my-4 max-w-2xl overflow-hidden rounded-xl border border-orange-200 bg-linear-to-br from-orange-50 via-white to-amber-50 px-4 py-4 sm:my-8 sm:px-6 sm:py-5">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            {/* Content */}
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-500 sm:h-11 sm:w-11">
                <ShoppingBag className="size-5 text-white sm:size-6" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm leading-5 font-semibold text-gray-900 sm:text-base">
                  {user_details ? "Keep discovering" : "Welcome to Shopinger"}
                </h3>

                <p className="mt-0.5 text-xs leading-4 font-medium text-gray-600 sm:text-sm sm:leading-5">
                  {user_details
                    ? "More products are waiting for you."
                    : "Login in for the best shopping experience."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (user_details) {
                  setHasStartedLoadingMore(true);
                  fetchNextPage();
                } else {
                  openLoginModal({});
                }
              }}
              disabled={is_logged_in && isFetchingNextPage}
              className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-orange-600 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm"
            >
              <span>
                {user_details
                  ? isFetchingNextPage
                    ? "Loading..."
                    : "View more"
                  : "Sign in"}
              </span>
              <ArrowRight className=" text-white size-4" />

            </button>
          </div>
        </div>
      ) : (
        hasNextPage && <div ref={load_more_ref} className="h-1" />
      )}
    </div>
  );
};
export default NProducts;
