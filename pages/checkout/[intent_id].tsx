import { useState } from "react";
import dynamic from "next/dynamic";
import Head from "next/head";
// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { IAddress } from "@/types/address";
import type { GetServerSideProps } from "next";
import type { ICart } from "@/types/cart";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import CheckoutDetail from "@/components/checkout/checkout-detail.component";
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
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import useDeleteAddressMutation from "@/hooks/axios/address/use-delete-address-mutation.hook";

// icons
import { MapPin } from "lucide-react";

// helpers
import Axios from "@/lib/axios/private.lib";

type IResponse = ICart & {
  expires_at: string;
  intent_id: string;
  type: "buy_now";
};

const getCheckoutIntent = (intent_id: string, cookie: string) => {
  const response = Axios.get<IResponse>(`/checkout/intent/${intent_id}`, {
    headers: cookie
      ? {
          cookie,
        }
      : {},
  });
  return response;
};

export type IAddressModalState = {
  open: boolean;
  data: IAddress | null;
  action_type?: "checkout";
};

type IProps = {
  products: ICart["items"];
  sub_total: number;
  total_amount: number;
  total_discount: number;
  total_items: number;
};

const CheckoutPage: NextPageWithLayout<IProps> = ({
  products,
  sub_total,
  total_amount,
  total_discount,
  total_items,
}) => {
  const { data: user_addresses = [] } = useUserAddresses();
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
            total_amount={total_amount}
            total_discount={total_discount}
            total_items={total_items}
            sub_total={sub_total}
            products={products}
            selected_address={selected_address}
            handleAddressDrawerState={(open) => setIsAddressDrawerOpen(open)}
            handleOrderSuccess={() => {}}
          />
        </div>
      </section>
    </>
  );
};

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};

export const getServerSideProps = (async ({ params, req }) => {
  const intent_id = params?.intent_id as string;
  const cookie = req.headers.cookie ?? "";
  if (!intent_id) {
    return { notFound: true };
  }

  const {
    data: { items, sub_total, total_amount, total_discount, total_items },
  } = await getCheckoutIntent(intent_id, cookie);

  return {
    props: {
      products: items,
      sub_total,
      total_amount,
      total_discount,
      total_items,
    },
  };
}) satisfies GetServerSideProps<IProps>;

export default CheckoutPage;
