// types
import type { FC } from "react";
import type { IAddress } from "@/types/address";
import type IOrder from "@/types/order";
import type { ICart } from "@/types/cart";

// local components
import AddressBar from "@/components/cart/address-bar.component";
import CheckoutItem from "@/components/checkout/checkout-item.component";
import CheckoutSummary from "@/components/checkout/checkout-summary.component";
import HelpSection from "@/components/common/help-section.component";

type IProps = {
  intent_id: string;
  products: ICart["items"];
  selected_address: IAddress | null;
  sub_total: number;
  total_amount: number;
  total_discount: number;
  total_mrp: number;
  platform_fee: number;
  total_items: number;
  handleAddressDrawerState: (open: boolean) => void;
  handleOrderSuccess: (order: IOrder) => void;
};
const CheckoutDetail: FC<IProps> = ({
  intent_id,
  products,
  selected_address,
  sub_total,
  total_amount,
  total_discount,
  total_mrp,
  platform_fee,
  total_items,
  handleAddressDrawerState,
  handleOrderSuccess,
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
        <div className="h-min overflow-hidden rounded-xl border border-gray-300 bg-white">
          {products?.flatMap(({ variants, ...product }) =>
            variants.map((variant) => (
              <CheckoutItem
                product={product}
                variant={variant}
                key={`cart-item-${variant.id}`}
                type="buy-checkout"
                intent_id={intent_id}
              />
            )),
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-(--header-height)">
        <CheckoutSummary
          handleShowLoginModal={() => {
            // handleShowLoginModal("checkout");
          }}
          handleShowAddresDrawer={() => {
            handleAddressDrawerState(true);
          }}
          sub_total={sub_total ?? 0}
          total_amount={total_amount ?? 0}
          total_discount={total_discount ?? 0}
          total_mrp={total_mrp}
          platform_fee={platform_fee}
          total_items={total_items ?? 0}
          selected_address={selected_address}
          handleOrderSuccess={handleOrderSuccess}
          intent_id={intent_id}
          type="buy-checkout"
        />
        <HelpSection
          title={"Need help completing your order?"}
          description={
            "Facing issues with payment, address, or checkout? We’re here to help."
          }
        />
      </div>
    </div>
  );
};

export default CheckoutDetail;
