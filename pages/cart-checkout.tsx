import { useState, useEffect } from "react";
import Head from "next/head";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";
import type { IAddress } from "@/types/address";
import type { IResponse as IVerifyPaymentResponse } from "@/hooks/axios/cart/verify-payment-mutation.hook";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CartDetails from "@/components/cart/cart-details.component";
import EmptyCart from "@/components/cart/empty-cart.component";
import OrderSuccessfulModal from "@/components/cart/order-successful-modal.component";
// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import { useSnackbarOffset } from "@/hooks/common/use-snackbar-offset.hook";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";

// lib
import { prefetchCommonData } from "@/lib/prefetch-common-data.lib";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

export type IAddressModalState = {
  open: boolean;
  data: IAddress | null;
};
const CartCheckoutPage: NextPageWithLayout = () => {
  useSnackbarOffset({});
  const { data: user_addresses = [] } = useUserAddresses();
  const { address_id } = useAddressDrawerContext();
  const [selected_address, setSelectedAddress] = useState<IAddress | null>(
    null,
  );
  const [order_success_modal_state, setOrderSuccessModalState] = useState<{
    open: boolean;
    order?: IVerifyPaymentResponse["order"];
  }>({
    open: false,
  });
  const { data } = useCart();

  useEffect(() => {
    const globally_selected_address = user_addresses.find(
      (address) => address.id == address_id,
    );
    setSelectedAddress(globally_selected_address ?? null);
  }, [address_id]);

  useEffect(() => {
    const default_address = user_addresses.find(
      (address) => address.is_default,
    );

    const globally_selected_address = user_addresses.find(
      (address) => address.id == address_id,
    );
    if (!selected_address) {
      setSelectedAddress(globally_selected_address ?? default_address ?? null);
    }
  }, [user_addresses.length, address_id]);

  return (
    <>
      <Head>
        <title>My Cart | Shopinger</title>
        <meta
          name="description"
          content="Review the items in your cart, update quantities, and proceed to checkout securely on Shopinger."
          key="desc"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <OrderSuccessfulModal
        is_open={order_success_modal_state.open}
        order_id={order_success_modal_state.order?.id}
        order_name={order_success_modal_state.order?.order_name}
        total_amount={order_success_modal_state.order?.total_amount}
        onClose={() =>
          setOrderSuccessModalState({
            open: false,
          })
        }
      />
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          {/* Cart header */}
          {!!data?.total_items ? (
            <>
              <CartDetails
                selected_address={selected_address}
                handleOrderSuccess={(order) => {
                  setOrderSuccessModalState({
                    open: true,
                    order,
                  });
                }}
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
  return <MainLayout show_bottom_navigation={true}>{page}</MainLayout>;
};
