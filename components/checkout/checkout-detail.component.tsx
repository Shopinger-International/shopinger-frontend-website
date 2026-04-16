// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";
import type IOrder from "@/types/order";

// local components
import AddressBar from "@/components/cart/address-bar.component";

type IProps = {
  selected_address: IAddress | null;
  handleAddressDrawerState: (open: boolean) => void;
  handleOrderSuccess: (order: IOrder) => void;
};
const CheckoutDetail: FC<IProps> = ({
  selected_address,
  handleAddressDrawerState,
  handleOrderSuccess
}) => {
  return (
    <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Left Section */}
      <div className="col-span-1 space-y-4 lg:col-span-2">
        {/* Address Bar */}
        <AddressBar
          address={selected_address}
          handleShowAddressDrawer={() => handleAddressDrawerState(true)}
        />

        {/* Cart Items */}
      </div>

      {/* Summary */}
    </div>
  );
};

export default CheckoutDetail;
