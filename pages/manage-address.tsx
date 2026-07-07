import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Head from "next/head";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";
import type IUser from "@/types/user";

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
    onSuccess?: (value: any) => void;
    onCancel?: () => void;
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

  useEffect(() => {
    if (!address_modal_state.open) return;

    const handlePopState = () => {
      setAddressModalState({
        open: false,
        data: null,
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [address_modal_state.open]);
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
          login_modal_state.onCancel?.();
          setLoginModalState({
            open: false,
          });
        }}
        handleOnSuccess={(user) => {
          login_modal_state.onSuccess?.(user);
          setLoginModalState({
            open: false,
          });
        }}
      />

      {is_mobile ? (
        <MobileAddressModal
          open={address_modal_state.open}
          initial_data={address_modal_state.data}
          handleLogin={openLoginModal}
          onClose={() => history.back()}
        />
      ) : (
        <AddAddressModal
          open={address_modal_state.open}
          initial_data={address_modal_state.data}
          handleLogin={openLoginModal}
          onClose={() => history.back()}
        />
      )}
      <section className="min-h-screen w-full py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900 sm:text-2xl">
              My Addresses
            </h1>
          </div>
          <AddressDetail
            handleAddressModalState={(open, data) =>
              setAddressModalState({
                open,
                data,
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
  const query_client = new QueryClient();

  await query_client.prefetchQuery<IAddress[]>({
    queryKey: ["user-addresses"],
    queryFn: async () => {
      return await getUserAddresses(cookie);
    },
  });

  return {
    props: {
      dehydratedState: dehydrate(query_client),
    },
  };
};

ManageAddress.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
