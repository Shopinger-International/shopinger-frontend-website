import { useRef, useEffect, useContext } from "react";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { IResponseType } from "@/hooks/axios/wishlist/use-get-wishlist.hook";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// hooks
import useGetWishlist from "@/hooks/axios/wishlist/use-get-wishlist.hook";

// local components
import WishlistItem from "@/components/wishlist/wishlist-item.component";
import WishlistItemSkeleton from "@/components/wishlist/wishlist-item-skeleton.component";
import EmtpyWishlist from "@/components/wishlist/empty-wishlist.component";

// context
import { FooterStateContext } from "@/context";

// provider
import FooterStateProvider from "@/provider/footer-state-provider";

const LIMIT = 10;

const Wishlist: NextPageWithLayout = () => {
  const { updateShow: updateShowFooter } = useContext(FooterStateContext);
  const {
    data,
    isPending: isWishlistPending,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetWishlist({ limit: LIMIT });

  const wishlist_data = data?.pages.reduce<IResponseType["data"]>(
    (acc, { data }) => {
      return [...acc, ...data];
    },
    [],
  );
  const show_empty_wishlist =
    !isWishlistPending && (wishlist_data?.length ?? 0) === 0;
  const load_more_ref = useRef<HTMLDivElement | null>(null);
  const observer_ref = useRef<IntersectionObserver | null>(null);

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
    updateShowFooter?.(!hasNextPage && !isWishlistPending);
  }, [hasNextPage, isWishlistPending]);
  return (
    <section className="w-full bg-gray-50 py-4">
      <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
        <div className="mb-4 flex items-center justify-between sm:mb-6">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
            My Wishlist
          </h1>
        </div>
        <div className="space-y-3">
          {isWishlistPending ? (
            Array.from({ length: LIMIT }).map((_, i) => (
              <WishlistItemSkeleton key={`initial-skeleton-${i}`} />
            ))
          ) : show_empty_wishlist ? (
            <EmtpyWishlist />
          ) : (
            wishlist_data?.map((wishlist_item) => (
              <WishlistItem {...wishlist_item} key={wishlist_item.variant_id} />
            ))
          )}

          {!isWishlistPending &&
            isFetchingNextPage &&
            Array.from({ length: LIMIT }).map((_, i) => (
              <WishlistItemSkeleton key={`next-page-skeleton-${i}`} />
            ))}
        </div>

        {/* observer */}
        {hasNextPage && <div ref={load_more_ref} className="h-1" />}
      </div>
    </section>
  );
};

export default Wishlist;

Wishlist.getLayout = function getLayout(page: ReactElement) {
  return (
    <FooterStateProvider default_show={false}>
      <MainLayout>{page}</MainLayout>
    </FooterStateProvider>
  );
};
