import Head from "next/head";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";
import type { GetServerSideProps } from "next";
import type { DehydratedState } from "@tanstack/react-query";

// layout
import MainLayout from "@/components/layout/main-layout.component";
import AddressDetail from "@/components/manage-address/addresses-detail.component";

// react query
import { QueryClient, dehydrate } from "@tanstack/react-query";

// helpers
import { getUserAddresses } from "@/hooks/axios/address/use-user-addresses.hook";
import { IAddress } from "@/types/address";

const ManageAddress: NextPageWithLayout = () => {
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
      <section className="min-h-screen w-full py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Your Addresses
            </h1>
          </div>
          <AddressDetail />
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
