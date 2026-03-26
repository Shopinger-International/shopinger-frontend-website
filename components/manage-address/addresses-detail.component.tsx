import dynamic from "next/dynamic";
import { useState } from "react";
// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";

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

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";

const AddressDetail: FC = () => {
  const { data: addresses = [] } = useUserAddresses();
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
      <section className="flex flex-wrap gap-6">
        <button
          onClick={() =>
            setAddressModalState({
              open: true,
              data: null,
            })
          }
          className="min-h-50 w-full rounded-2xl border-2 border-dashed border-gray-300 p-6 text-gray-600 hover:border-orange-500 hover:text-orange-500 md:w-xs"
        >
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <span className="text-3xl font-light">+</span>
            <span className="text-sm font-medium">Add New Address</span>
          </div>
        </button>
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            data={address}
            onEdit={(data: IAddress) => {
              setAddressModalState({
                data,
                open: true,
              });
            }}
          />
        ))}
      </section>
    </>
  );
};

export default AddressDetail;
