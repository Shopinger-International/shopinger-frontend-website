import { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// local components
import AddressCard from "@/components/manage-address/address-card.component";

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

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";

export const addresses = [
  {
    id: "1",
    full_name: "Ashish Prajapati",
    phone: "9876543210",
    house_number: "Flat 402",
    address1: "Shiv Residency, MG Road",
    landmark: "Opposite McDonald's",
    place_id: "ChIJN1t_tDeuEmsRUsoyG83frY4",
    formatted_address:
      "Flat 402, Shiv Residency, MG Road, Andheri East, Mumbai, Maharashtra 400069",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400069",
    latitude: 19.1197,
    longitude: 72.8464,
    address_type: "home",
    delivery_instructions: "Call before arrival",
    is_default: true,
  },
  {
    id: "2",
    full_name: "Ashish Prajapati",
    phone: "9876543210",
    house_number: "Office 12B",
    address1: "WeWork, BKC",
    landmark: "Near Jio World Drive",
    place_id: "ChIJRcbZaklY5zsR1zGf1sVfK0E",
    formatted_address:
      "Office 12B, WeWork, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400051",
    latitude: 19.0606,
    longitude: 72.8656,
    address_type: "work",
    delivery_instructions: "Leave at reception",
    is_default: false,
  },
  {
    id: "3",
    full_name: "Rohit Sharma",
    phone: "9123456780",
    house_number: "Shop 3",
    address1: "Ganesh Market, Linking Road",
    landmark: "Near KFC",
    place_id: "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
    formatted_address:
      "Shop 3, Ganesh Market, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    latitude: 19.0596,
    longitude: 72.8295,
    address_type: "other",
    delivery_instructions: "",
    is_default: false,
  },
  {
    id: "4",
    full_name: "Priya Mehta",
    phone: "9988776655",
    house_number: "Villa 7",
    address1: "Palm Grove Society",
    landmark: "Near Infinity Mall",
    place_id: "ChIJIQBpAG2ahYAR_6128GcTUEo",
    formatted_address:
      "Villa 7, Palm Grove Society, Malad West, Mumbai, Maharashtra 400064",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400064",
    latitude: 19.186,
    longitude: 72.8486,
    address_type: "home",
    delivery_instructions: "Ring the bell twice",
    is_default: false,
  },
];

const ManageAddress: NextPageWithLayout = () => {
  const [show_address_modal, setShowAddressModal] = useState(false);
  const is_mobile = useIsMobile();
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
        {is_mobile ? (
          <MobileAddressModal
            open={show_address_modal}
            onClose={() => setShowAddressModal(false)}
          />
        ) : (
          <AddAddressModal
            open={show_address_modal}
            onClose={() => setShowAddressModal(false)}
          />
        )}
        <div className="mx-auto mt-(--header-height) max-w-6xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              Your Addresses
            </h1>
          </div>
          <div className="flex flex-wrap gap-6">
            <button
              onClick={() => setShowAddressModal(true)}
              className="w-xs rounded-2xl border-2 border-dashed border-gray-300 p-6 text-gray-500 transition hover:border-orange-500 hover:text-orange-500"
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
