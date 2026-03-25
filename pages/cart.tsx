import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import CartDetails from "@/components/cart/cart-details.component";
import EmptyCart from "@/components/cart/empty-cart.component";
import LoginModal from "@/components/login/login-modal.component";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";

// helpers

const CartPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [show_login_modal, setShowLoginModal] = useState(false);
  const { data, isPending } = useCart();

  if (isPending) return null;
  return (
    <>
      <Head>
        <title>Your Cart | Shopinger</title>
        <meta
          name="description"
          content="Review the items in your cart, update quantities, and proceed to checkout securely on Shopinger."
          key="desc"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <LoginModal
        open={show_login_modal}
        handleClose={() => {
          setShowLoginModal(false);
        }}
        handleOnSuccess={() => {
          /**
           * Redirecting user to checkout page because,
           * this only shows when user click on checkout,
           * so once successfull login he would like to got
           * checkout page
           */
          router.push("/checkout");
        }}
      />
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          {/* Cart header */}

          {!!data?.total_items ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h1 className="text-xl font-semibold text-gray-900">
                  Your Cart
                </h1>

                <span className="text-sm text-gray-500">
                  {data?.total_items} items
                </span>
              </div>
              <CartDetails
                handleShowLoginModal={() => setShowLoginModal(true)}
              />
            </>
          ) : (
            <EmptyCart />
          )}
        </div>
      </section>
    </>
  );
};

export default CartPage;

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
