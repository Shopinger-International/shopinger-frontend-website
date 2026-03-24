import type { FC } from "react";
import { useState } from "react";
import Head from "next/head";

// layout
import MainLayout from "@/components/layout/main-layout.component";

// types
import type { ReactElement } from "react";
import type { NextPageWithLayout } from "@/pages/_app";

// local components
import Stepper from "@/components/common/progess-stepper.component";
import AddressDetail from "@/components/manage-address/addresses-detail.component";
import CartDetails from "@/components/cart/cart-details.component";

const steps = [
  {
    id: 1,
    title: "Delivery Address",
    description: "Enter where you want your order delivered",
  },
  {
    id: 2,
    title: "Order Summary",
    description: "Review items, quantities, and total price",
  },
  {
    id: 3,
    title: "Payment",
    description: "Choose a payment method and complete your order",
  },
];
const CheckoutPage: NextPageWithLayout = () => {
  const [selected_step, setSelectedStep] = useState(1);
  const [selected_address_id, setSelectedAddressId] = useState<number | null>(
    null,
  );
  return (
    <>
      <Head>
        <title>Checkout | Shopinger</title>
        <meta
          name="description"
          content="Review the items in your cart, update quantities, and proceed to checkout securely on Shopinger."
          key="desc"
        />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <section className="w-full bg-gray-50 py-4">
        <div className="mx-auto mt-(--header-height) max-w-6xl space-y-6 px-4">
          <Stepper
            steps={steps}
            selected_step={selected_step}
            updateStep={(step) => setSelectedStep(step)}
          />
          <div className="rounded-xl border border-gray-300 bg-gray-50 p-6">
            <StepRenderer
              step={selected_step}
              selected_address_id={selected_address_id}
              updateSelectedAddress={(address_id) => {
                console.log("value of address id", address_id);
                setSelectedAddressId(address_id);
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default CheckoutPage;

const StepRenderer: FC<{
  step: number;
  selected_address_id: number | null;
  updateSelectedAddress: (address_id: number) => void;
}> = ({ step, selected_address_id, updateSelectedAddress }) => {
  switch (step) {
    case 1:
      return (
        <AddressDetail
          show_selected={true}
          selected_address_id={selected_address_id}
          updateSelectedAddress={updateSelectedAddress}
        />
      );
    case 2:
      return <CartDetails handleShowLoginModal={() => {}} />;
    case 3:
      return null;
  }
};

CheckoutPage.getLayout = function getLayout(page: ReactElement) {
  return <MainLayout>{page}</MainLayout>;
};
