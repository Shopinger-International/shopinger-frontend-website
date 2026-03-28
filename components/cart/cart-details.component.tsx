import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
// types
import type { FC } from "react";

// hooks
import useCart from "@/hooks/axios/cart/use-cart.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";

// local components
import AddressBar from "@/components/cart/address-bar.component";
import CartItem from "@/components/cart/cart-item.component";
import SidebarDrawer from "@/components/common/sidebar-drawer.component";
import AddressRow from "@/components/cart/address-row.component";
import CartSummary from "@/components/cart/cart-summary.component";

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

// helpers
import { IAddress } from "@/types/address";

// hooks
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useDeleteAddressMutation from "@/hooks/axios/address/use-delete-address-mutation.hook";

type IProps = {
  handleShowLoginModal: () => void;
};

const CartDetails: FC<IProps> = ({ handleShowLoginModal }) => {
  const delete_address_mutation = useDeleteAddressMutation();
  const [is_address_drawer_open, setIsAddressDrawerOpen] = useState(false);
  const { data: cart } = useCart();
  const { data: user_addresses = [] } = useUserAddresses();
  const [selected_address, setSelectedAddress] = useState<IAddress | null>(
    null,
  );
  const [address_modal_state, setAddressModalState] = useState<{
    open: boolean;
    data: IAddress | null;
  }>({
    open: false,
    data: null,
  });
  const is_mobile = useIsMobile();

  useEffect(() => {
    const default_address = user_addresses.find(
      (address) => address.is_default,
    );
    if (default_address && !selected_address) {
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
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-2">
            {user_addresses.map((address) => (
              <AddressRow
                key={`address-row-${address.id}`}
                address={address}
                is_selected={address.id == selected_address?.id}
                onClick={() => {
                  setSelectedAddress(address);
                  setIsAddressDrawerOpen(false);
                }}
                onDelete={(data) => {
                  delete_address_mutation.mutate({
                    address_id: data.id,
                  });
                }}
                onEdit={(data) => {
                  setAddressModalState({
                    open: true,
                    data,
                  });
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 border-t border-gray-300 px-6 py-4 shadow-sm">
          <button
            className="w-full rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600"
            onClick={() =>
              setAddressModalState({
                open: true,
                data: null,
              })
            }
          >
            Add New Address
          </button>
        </div>
      </SidebarDrawer>
      {is_mobile ? (
        <MobileAddressModal
          open={address_modal_state.open}
          onClose={() =>
            setAddressModalState({
              open: false,
              data: null,
            })
          }
          initial_data={address_modal_state.data}
          handleOnSuccess={(address) => {
            setSelectedAddress(address);
            setIsAddressDrawerOpen(false);
          }}
        />
      ) : (
        <AddAddressModal
          open={address_modal_state.open}
          onClose={() =>
            setAddressModalState({
              open: false,
              data: null,
            })
          }
          initial_data={address_modal_state.data}
          handleOnSuccess={(address) => {
            setSelectedAddress(address);
            setIsAddressDrawerOpen(false);
          }}
        />
      )}
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
