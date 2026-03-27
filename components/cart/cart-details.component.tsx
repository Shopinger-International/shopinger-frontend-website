import { useState, useEffect } from "react";
// types
import type { FC } from "react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";

// local components
import AddressBar from "./address-bar.component";
import CartItem from "@/components/cart/cart-item.component";
import SidebarDrawer from "@/components/common/sidebar-drawer.component";
import AddressRow from "./address-row.component";
import CartSummary from "@/components/cart/cart-summary.component";

// helpers
import { IAddress } from "@/types/address";

type IProps = {
  handleShowLoginModal: () => void;
};

const CartDetails: FC<IProps> = ({ handleShowLoginModal }) => {
  const [is_address_drawer_open, setIsAddressDrawerOpen] = useState(false);
  const { data: cart } = useCart();
  const { data: user_addresses = [] } = useUserAddresses();
  const [selected_address, setSelectedAddress] = useState<IAddress | null>(
    null,
  );

  useEffect(() => {
    const default_address = user_addresses.find(
      (address) => address.is_default,
    );
    if (default_address) {
      setSelectedAddress(default_address);
    }
  }, [user_addresses.length]);
  return (
    <>
      <SidebarDrawer
        is_open={is_address_drawer_open}
        handleClose={() => setIsAddressDrawerOpen(false)}
        title={"Change Address"}
      >
        {user_addresses.map((address) => (
          <AddressRow address={address} />
        ))}
      </SidebarDrawer>
      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Section */}
        <div className="col-span-1 space-y-4 lg:col-span-2">
          {/* Address Bar */}
          <AddressBar
            address={selected_address}
            handleShowAddressDrawer={() => setIsAddressDrawerOpen(true)}
          />

          {/* Cart Items */}
          <div className="h-min overflow-hidden rounded-xl border border-gray-300 bg-white">
            {cart?.items?.flatMap(({ variants, ...product }) =>
              variants.map((variant) => (
                <CartItem
                  product={product}
                  variant={variant}
                  key={`cart-item-${variant.id}`}
                />
              )),
            )}
          </div>
        </div>

        {/* Summary */}
        <CartSummary
          handleShowLoginModal={handleShowLoginModal}
          total_amount={cart?.total_amount ?? 0}
          total_discount={cart?.total_discount ?? 0}
          charges={50}
        />
      </div>
    </>
  );
};

export default CartDetails;
