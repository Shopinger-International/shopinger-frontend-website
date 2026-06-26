import { useRouter } from "next/router";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { IAddress } from "@/types/address";
import type { GetServerSideProps } from "next";
import type { IResponse } from "@/hooks/axios/checkout/use-checkout-intent.hook";
import type { IResponse as IVerifyPaymentResponse } from "@/hooks/axios/cart/verify-payment-mutation.hook";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import ProtectedLayout from "@/components/layout/protected-layout.component";

// local components
import CheckoutDetail from "@/components/checkout/checkout-detail.component";
import SidebarDrawer from "@/components/common/sidebar-drawer.component";
import AddressRow from "@/components/cart/address-row.component";
import OrderSuccessfulModal from "@/components/cart/order-successful-modal.component";

// lib
import insightsClient from "@/lib/algolia/algolia-insight.lib";

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
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import useDeleteAddressMutation from "@/hooks/axios/address/use-delete-address-mutation.hook";
import useCheckoutIntent from "@/hooks/axios/checkout/use-checkout-intent.hook";

// icons
import { MapPin } from "lucide-react";

// helpers
import { getCheckoutIntent } from "@/hooks/axios/checkout/use-checkout-intent.hook";

export type IAddressModalState = {
  open: boolean;
  data: IAddress | null;
  action_type?: "checkout";
};

type IProps = {
  intent_id: string;
};

const CheckoutPage: NextPageWithLayout<IProps> = ({ intent_id }) => {
  const router = useRouter();
  const { data: intent_details } = useCheckoutIntent(intent_id);
  const { data: user_addresses = [], isPending } = useUserAddresses();
  const is_mobile = useIsMobile();
  const delete_address_mutation = useDeleteAddressMutation();
  const [selected_address, setSelectedAddress] = useState<IAddress | null>(
    null,
  );

  const [is_address_drawer_open, setIsAddressDrawerOpen] = useState(false);
  const [address_modal_state, setAddressModalState] =
    useState<IAddressModalState>({
      open: false,
      data: null,
    });
  const [order_success_modal_state, setOrderSuccessModalState] = useState<{
    open: boolean;
    order?: IVerifyPaymentResponse["order"];
  }>({
    open: false,
  });

  useEffect(() => {
    if (!isPending && user_addresses.length) {
      const default_address = user_addresses.find(
        (address) => address.is_default,
      );
      default_address && setSelectedAddress(default_address);
    }
  }, [isPending, user_addresses]);

  return (
    <>
      <Head>
        <title>Secure Checkout | Shopinger</title>
        <meta
          name="description"
          content="Complete your purchase securely. Review your order and confirm delivery details on Shopinger."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <OrderSuccessfulModal
        is_open={order_success_modal_state.open}
        order_id={order_success_modal_state.order?.id}
        total_amount={order_success_modal_state.order?.total_amount}
        onClose={() =>
          setOrderSuccessModalState({
            open: false,
          })
        }
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
          <CheckoutDetail
            intent_id={intent_id}
            total_amount={intent_details?.total_amount ?? 0}
            total_discount={intent_details?.total_discount ?? 0}
            total_items={intent_details?.total_items ?? 0}
            sub_total={intent_details?.sub_total ?? 0}
            total_mrp={intent_details?.total_mrp ?? 0}
            platform_fee={intent_details?.platform_fee ?? 0}
            products={intent_details?.items ?? []}
            selected_address={selected_address}
            handleAddressDrawerState={(open) => setIsAddressDrawerOpen(open)}
            handleOrderSuccess={(order) => {
              setOrderSuccessModalState({
                open: true,
                order,
              });

              const query = router.query;
              const query_id =
                typeof query.query_id === "string" ? query.query_id : undefined;

              const index_name =
                typeof query.index_name === "string"
                  ? query.index_name
                  : undefined;

              const object_id =
                typeof query.object_id === "string"
                  ? query.object_id
                  : undefined;

              query_id &&
                index_name &&
                object_id &&
                insightsClient("purchasedObjectIDsAfterSearch", {
                  eventName: "Product Purchased",
                  index: index_name,
                  objectIDs: [object_id],
                  objectData: [
                    {
                      queryID: query_id,
                      price: order.total_amount,
                      discount: order.discount,
                      quantity: order.order_items.reduce((acc, item) => {
                        acc += item.quantity;
                        return acc;
                      }, 0),
                    },
                  ],
                  value: order.total_amount,
                  currency: "INR",
                });
            }}
          />
        </div>
      </section>
    </>
  );
};

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <ProtectedLayout>
      <MainLayout>{page}</MainLayout>
    </ProtectedLayout>
  );
};

export const getServerSideProps = (async ({ params, req }) => {
  const intent_id = params?.intent_id as string;
  const query_client = new QueryClient();
  const cookie = req.headers.cookie ?? "";
  if (!intent_id) {
    return { notFound: true };
  }
  try {
    await query_client.fetchQuery<IResponse>({
      queryKey: ["buy-intent", intent_id],
      queryFn: async () => {
        const { data } = await getCheckoutIntent(intent_id, cookie);
        return data;
      },
    });
    return {
      props: {
        intent_id,
        dehydratedState: dehydrate(query_client),
      },
    };
  } catch (error: any) {
    const status = error?.response?.status;

    if (status === 404) {
      return {
        redirect: {
          destination: "/404",
          permanent: false,
        },
      };
    }

    if (status === 401) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }

    // fallback: generic error page
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}) satisfies GetServerSideProps<IProps>;

export default CheckoutPage;
