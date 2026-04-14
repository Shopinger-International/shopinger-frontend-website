// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";

// local components
import AddressCard from "@/components/manage-address/address-card.component";
// hooks
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

type IProps = {
  handleAddressModalState: (open: boolean, data: IAddress | null) => void;
};

const AddressDetail: FC<IProps> = ({
  handleAddressModalState,
}) => {
  const { data: user_detail } = useUserDetails();
  return (
    <>
      <section className="flex flex-wrap gap-6">
        <button
          onClick={() => handleAddressModalState(true, null)}
          className="min-h-50 w-full rounded-2xl border-2 border-dashed border-gray-300 p-6 text-gray-600 hover:border-orange-500 hover:text-orange-500 md:w-xs"
        >
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <span className="text-3xl font-light">+</span>
            <span className="text-sm font-medium">Add New Address</span>
          </div>
        </button>
        {user_detail?.user_addresses.map((address) => (
          <AddressCard
            key={address.id}
            data={address}
            onEdit={(data: IAddress) => {
              handleAddressModalState(true, data);
            }}
          />
        ))}
      </section>
    </>
  );
};

export default AddressDetail;
