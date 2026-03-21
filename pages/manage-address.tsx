import { useState } from "react";
import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import AddressCard from "@/components/manage-address/address-card.component";
import AddAddressModal from "@/components/manage-address/add-address-modal/add-address-modal.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// hooks
import useGetPlaces from "@/hooks/axios/common/use-get-places.hook";

const addresses = [
  {
    id: "1",
    name: "Yogita Chouhan",
    address: "Singapore Township, Dewas Naka, Indore - 452001",
    phone: "9876543210",
    type: "home",
    isDefault: true,
  },
  {
    id: "2",
    name: "Yogita Chouhan",
    address: "Singapore Township, Dewas Naka, Indore - 452001",
    type: "Work",
    phone: "9876543210",
    isDefault: false,
  },
];

const ManageAddress: NextPageWithLayout = () => {
  const [show_address_modal, setShowAddressModal] = useState(false);
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
      <section className="min-h-screen w-full py-4">
        <AddAddressModal
          open={show_address_modal}
          onClose={() => setShowAddressModal(false)}
        />
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Your Addresses
            </h1>
          </div>
          <div className="flex flex-wrap gap-6">
            <button
              onClick={() => setShowAddressModal(true)}
              className="w-sm rounded-2xl border-2 border-dashed border-gray-300 p-6 text-gray-500 transition hover:border-orange-500 hover:text-orange-500"
            >
              <div className="flex h-full flex-col items-center justify-center gap-2">
                <span className="text-3xl font-light">+</span>
                <span className="text-sm font-medium">Add New Address</span>
              </div>
            </button>
            {addresses.map((address) => (
              <AddressCard key={address.id} data={address} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ManageAddress;

ManageAddress.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
