// types
import type { FC } from "react";
import type IOrder from "@/types/order";
import type { IAddress } from "@/types/address";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";

// local components
import AddressBar from "@/components/cart/address-bar.component";
import CheckoutItem from "@/components/checkout/checkout-item.component";
import CheckoutSummary from "@/components/checkout/checkout-summary.component";
import HelpSection from "@/components/common/help-section.component";

type IProps = {
  selected_address: IAddress | null;
  handleAddressDrawerState: (open: boolean) => void;
  handleShowLoginModal: (action_type: "checkout" | "change_address") => void;
  handleOrderSuccess: (order: IOrder) => void;
};

const CartDetails: FC<IProps> = ({
  selected_address,
  handleShowLoginModal,
  handleAddressDrawerState,
  handleOrderSuccess,
}) => {
  const { data: user_detail } = useUserDetails();
  const { data: cart } = useCart();

  return (
    <div className="space-y-6">
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
                <CheckoutItem
                  product={product}
                  variant={variant}
                  key={`cart-item-${variant.id}`}
                  type="cart-checkout"
                />
              )),
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="flex flex-col gap-4 lg:sticky lg:top-(--header-height)">
          <CheckoutSummary
            handleShowLoginModal={() => {
              handleShowLoginModal("checkout");
            }}
            handleShowAddresDrawer={() => {
              handleAddressDrawerState(true);
            }}
            sub_total={cart?.sub_total ?? 0}
            total_amount={cart?.total_amount ?? 0}
            total_discount={cart?.total_discount ?? 0}
            total_items={cart?.total_items ?? 0}
            total_mrp={cart?.total_mrp ?? 0}
            platform_fee={cart?.platform_fee ?? 0}
            type={"cart-checkout"}
            selected_address={selected_address}
            handleOrderSuccess={handleOrderSuccess}
          />
          <HelpSection
            title={"Need help completing your order?"}
            description={
              "Facing issues with payment, address, or checkout? We’re here to help."
            }
          />
        </div>
      </div>
      {/* <div className="flex h-30 w-full flex-col space-y-2 rounded-xl border border-gray-300 bg-white">
        <div className="border-b border-gray-300 px-6 py-3">
          <h2 className="text-xl font-medium">Saved for later</h2>
        </div>
      </div> */}
    </div>
  );
};

export default CartDetails;
