import { useRef, useEffect, useContext, useState } from "react";
// types
import type { NextPageWithLayout } from "@/pages/_app";
import type { ReactElement } from "react";
import type { IResponseType } from "@/hooks/axios/wishlist/use-get-wishlist.hook";
import type IUser from "@/types/user";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// hooks
import useGetWishlist from "@/hooks/axios/wishlist/use-get-wishlist.hook";

// local components
import WishlistItem from "@/components/wishlist/wishlist-item.component";
import WishlistItemSkeleton from "@/components/wishlist/wishlist-item-skeleton.component";
import EmtpyWishlist from "@/components/wishlist/empty-wishlist.component";
import LoginModal from "@/components/login/login-modal.component";

// context
import { FooterStateContext } from "@/context";

// provider
import FooterStateProvider from "@/provider/footer-state-provider";

const LIMIT = 10;

export type ILoginModalState = {
  open: boolean;
  onSuccess?: (user: IUser) => void;
  onCancel?: () => void;
};

const Wishlist: NextPageWithLayout = () => {
  const { updateShow: updateShowFooter } = useContext(FooterStateContext);
  const [login_modal_state, setLoginModalState] = useState<ILoginModalState>({
    open: false,
  });
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

  const openLoginModal = () => {
    return new Promise<IUser>((resolve, reject) => {
      setLoginModalState({
        open: true,
        onSuccess: (user: IUser) => {
          resolve(user);
        },
        onCancel: () => {
          reject();
        },
      });
    });
  };
  return (
    <>
      <LoginModal
        open={login_modal_state.open}
        handleClose={() => {
          setLoginModalState({
            open: false,
          });
          login_modal_state.onCancel?.();
        }}
        handleOnSuccess={(user) => {
          setLoginModalState({
            open: false,
          });
          login_modal_state.onSuccess?.(user);
        }}
      />
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) min-h-[calc(100vh-var(--header-height))] max-w-6xl px-4">
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
                <WishlistItem
                  {...wishlist_item}
                  key={wishlist_item.variant_id}
                  handleLoginModalState={({ open, onSuccess }) => {
                    setLoginModalState({
                      open,
                      ...(onSuccess ? { onSuccess } : {}),
                    });
                  }}
                />
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
    </>
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
