import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";
import type { IAddress } from "@/types/address";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CartDetails from "@/components/cart/cart-details.component";
import EmptyCart from "@/components/cart/empty-cart.component";
import LoginModal from "@/components/login/login-modal.component";
import SidebarDrawer from "@/components/common/sidebar-drawer.component";
import AddressRow from "@/components/cart/address-row.component";
const AddAddressModal = dynamic(
  () =>
    import("@/components/manage-address/add-address-modal/add-address-modal.component"),
  {
    ssr: false,
  },
);

const MobileAddressModal = dynamic(
  () =>
    import("@/components/manage-address/add-address-modal/mobile-location-picker-dialog.component"),
  {
    ssr: false,
  },
);

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import useDeleteAddressMutation from "@/hooks/axios/address/use-delete-address-mutation.hook";

// lib
import { prefetchCommonData } from "@/lib/prefetch-common-data.lib";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

// icons
import { MapPin } from "lucide-react";

export type IAddressModalState = {
  open: boolean;
  data: IAddress | null;
  action_type?: "checkout";
};
const CartCheckoutPage: NextPageWithLayout = () => {
  const { data: user_addresses = [] } = useUserAddresses();
  const delete_address_mutation = useDeleteAddressMutation();
  const is_mobile = useIsMobile();
  const [is_address_drawer_open, setIsAddressDrawerOpen] = useState(false);
  const [selected_address, setSelectedAddress] = useState<IAddress | null>(
    null,
  );
  const [login_modal_state, setLoginModalState] = useState<{
    open: boolean;
    action_type?: "checkout" | "change_address";
  }>({
    open: false,
  });

  const [address_modal_state, setAddressModalState] =
    useState<IAddressModalState>({
      open: false,
      data: null,
    });
  const { data } = useCart();

  useEffect(() => {
    const default_address = user_addresses.find(
      (address) => address.is_default,
    );
    if (default_address && !selected_address) {
      setSelectedAddress(default_address);
    }
  }, [user_addresses.length]);
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
        open={login_modal_state.open}
        handleClose={() => {
          setLoginModalState({
            open: false,
          });
        }}
        handleOnSuccess={() => {
          if (login_modal_state.action_type == "checkout") {
            setIsAddressDrawerOpen(true);
          } else if (login_modal_state.action_type == "change_address") {
            setIsAddressDrawerOpen(true);
          }
          setLoginModalState({
            open: false,
          });
        }}
      />

      {is_mobile ? (
        <MobileAddressModal
          open={address_modal_state.open}
          onClose={() =>
            setAddressModalState({
              open: false,
              data: null,
            })
          }
          initial_data={address_modal_state.data}
          handleOnSuccess={(address) => {
            setSelectedAddress(address);
            setIsAddressDrawerOpen(false);
          }}
        />
      ) : (
        <AddAddressModal
          open={address_modal_state.open}
          onClose={() =>
            setAddressModalState({
              open: false,
              data: null,
            })
          }
          initial_data={address_modal_state.data}
          handleOnSuccess={(address) => {
            setSelectedAddress(address);
            setIsAddressDrawerOpen(false);
          }}
        />
      )}
      <SidebarDrawer
        is_open={is_address_drawer_open}
        handleClose={() => setIsAddressDrawerOpen(false)}
        title={"Change Address"}
      >
        <div className="flex-1 overflow-y-auto px-6">
          <div className="h-full space-y-2">
            {user_addresses.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
                {/* Icon */}
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                  <MapPin className="h-5 w-5 text-orange-500" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-800">
                  No addresses yet
                </h3>

                {/* Subtitle */}
                <p className="mt-1 max-w-xs text-sm text-gray-500">
                  Add an address to make checkout faster and easier.
                </p>

                {/* CTA (important) */}
              </div>
            ) : (
              <div className="space-y-2">
                {user_addresses.map((address) => (
                  <AddressRow
                    key={`address-row-${address.id}`}
                    address={address}
                    is_selected={address.id == selected_address?.id}
                    onClick={() => {
                      setSelectedAddress(address);
                      setIsAddressDrawerOpen(false);
                    }}
                    onDelete={(data) => {
                      delete_address_mutation.mutate({
                        address_id: data.id,
                      });
                    }}
                    onEdit={(data) => {
                      setAddressModalState({
                        open: true,
                        data,
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 border-t border-gray-300 px-6 py-4 shadow-sm">
          <button
            className="w-full rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600"
            onClick={() =>
              setAddressModalState({
                open: true,
                data: null,
              })
            }
          >
            Add New Address
          </button>
        </div>
      </SidebarDrawer>
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          {/* Cart header */}

          {!!data?.total_items ? (
            <>
              <CartDetails
                selected_address={selected_address}
                handleAddressDrawerState={(open) =>
                  setIsAddressDrawerOpen(open)
                }
                handleShowLoginModal={(action_type) =>
                  setLoginModalState({
                    open: true,
                    action_type,
                  })
                }
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
