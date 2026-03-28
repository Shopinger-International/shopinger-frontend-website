import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CartDetails from "@/components/cart/cart-details.component";
import EmptyCart from "@/components/cart/empty-cart.component";
import LoginModal from "@/components/login/login-modal.component";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";

// lib
import { prefetchCommonData } from "@/lib/prefetch-common-data.lib";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

const CartCheckoutPage: NextPageWithLayout = () => {
  const router = useRouter();
  const [show_login_modal, setShowLoginModal] = useState(false);
  const { data } = useCart();

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

export default CartCheckoutPage;

type Props = {
  dehydratedState: DehydratedState;
};
export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const cookie = context.req.headers.cookie ?? "";
  const queryClient = new QueryClient();

  await prefetchCommonData(queryClient, cookie);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
CartCheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
