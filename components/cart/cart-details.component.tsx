// types
import type { FC } from "react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// local components
import AddressBar from "@/components/cart/address-bar.component";
import CartItem from "@/components/cart/cart-item.component";
import CartSummary from "@/components/cart/cart-summary.component";
import HelpSection from "@/components/common/help-section.component";

// helpers
import { IAddress } from "@/types/address";

type IProps = {
  selected_address: IAddress | null;
  handleAddressDrawerState: (open: boolean) => void;
  handleShowLoginModal: (action_type: "checkout" | "change_address") => void;
};

const CartDetails: FC<IProps> = ({
  selected_address,
  handleShowLoginModal,
  handleAddressDrawerState,
}) => {
  const { data: user_detail } = useUserDetails();
  const { data: cart } = useCart();

  return (
    <>
      <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Section */}
        <div className="col-span-1 space-y-4 lg:col-span-2">
          {/* Address Bar */}
          <AddressBar
            address={selected_address}
            handleShowAddressDrawer={() => {
              if (user_detail) {
                handleAddressDrawerState(true);
                return;
              }
              handleShowLoginModal("change_address");
            }}
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
        <div className="flex flex-col gap-4 lg:sticky lg:top-(--header-height)">
          <CartSummary
            handleShowLoginModal={() => {
              handleShowLoginModal("checkout");
            }}
            total_amount={cart?.total_amount ?? 0}
            total_discount={cart?.total_discount ?? 0}
            total_items={cart?.total_items ?? 0}
            charges={50}
            selected_address={selected_address}
          />
          <HelpSection
            title={"Need help completing your order?"}
            description={
              "Facing issues with payment, address, or checkout? We’re here to help."
            }
          />
        </div>
      </div>
    </>
  );
};

export default CartDetails;
