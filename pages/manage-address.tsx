import dynamic from "next/dynamic";
import { useState } from "react";
import Head from "next/head";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import AddressDetail from "@/components/manage-address/addresses-detail.component";

// local components
import LoginModal from "@/components/login/login-modal.component";
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

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

// helpers
import { getUserAddresses } from "@/hooks/axios/address/use-user-addresses.hook";
import { IAddress } from "@/types/address";

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";

const ManageAddress: NextPageWithLayout = () => {
  const [login_modal_state, setLoginModalState] = useState<{
    open: boolean;
    action_type?: "add_address";
  }>({
    open: false,
  });
  const [address_modal_state, setAddressModalState] = useState<{
    open: boolean;
    data: IAddress | null;
  }>({
    open: false,
    data: null,
  });
  const is_mobile = useIsMobile();
  return (
    <>
      <Head>
        <title>Manage Addresses | Shopinger</title>

        <meta
          name="description"
          content="Add, edit, or remove your saved delivery addresses. Manage your shipping details securely for faster checkout on Shopinger."
          key="desc"
        />

        <meta
          name="keywords"
          content="manage addresses, delivery address, shipping details, user addresses, Shopinger account"
        />

        {/* Prevent indexing since it's a private user page */}
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
          if (login_modal_state.action_type == "add_address") {
            setAddressModalState({
              open: true,
              data: null,
            });
          }
        }}
      />

      {is_mobile ? (
        <MobileAddressModal
          open={address_modal_state.open}
          initial_data={address_modal_state.data}
          onClose={() =>
            setAddressModalState({
              open: false,
              data: null,
            })
          }
        />
      ) : (
        <AddAddressModal
          open={address_modal_state.open}
          initial_data={address_modal_state.data}
          onClose={() =>
            setAddressModalState({
              open: false,
              data: null,
            })
          }
        />
      )}
      <section className="min-h-screen w-full py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Your Addresses
            </h1>
          </div>
          <AddressDetail
            handleAddressModalState={(open, data) =>
              setAddressModalState({
                open,
                data,
              })
            }
            showLoginModal={(action_type: "add_address") =>
              setLoginModalState({
                open: true,
                action_type,
              })
            }
          />
        </div>
      </section>
    </>
  );
};

export default ManageAddress;

type Props = {
  dehydratedState: DehydratedState;
};
export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const cookie = context.req.headers.cookie ?? "";
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery<IAddress[]>({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      return await getUserAddresses(cookie);
    },
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

ManageAddress.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
