import { useContext } from "react";
// types
import type { FC } from "react";

// local components
import SidebarDrawer from "@/components//common/sidebar-drawer.component";
import AddressRow from "@/components/cart/address-row.component";

// context
import { AddressDrawerState } from "@/context";

// icons
import { MapPin } from "lucide-react";

// hooks
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import useDeleteAddressMutation from "@/hooks/axios/address/use-delete-address-mutation.hook";
import { useSnackbarOffset } from "@/hooks/common/use-snackbar-offset.hook";

const SelectAddressDrawer: FC = () => {
  const delete_address_mutation = useDeleteAddressMutation();
  const { data: user_addresses = [] } = useUserAddresses();
  const { address_id, is_open, updateState } = useContext(AddressDrawerState);
  useSnackbarOffset({
    enabled: is_open,
  });
  return (
    <SidebarDrawer
      is_open={is_open}
      handleClose={() => history.back()}
      title={"Change Address"}
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex-1 overflow-y-auto px-6">
          <div className="h-full space-y-2">
            {user_addresses.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center px-6 py-10 text-center">
                {/* Icon */}
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
                  <MapPin className="h-5 w-5 text-orange-500" />
                </div>

                {/* Title */}
                <h3 className="text-base font-semibold text-gray-800">
                  No addresses yet
                </h3>

                {/* Subtitle */}
                <p className="mt-1 max-w-xs text-sm text-gray-500">
                  Add an address to make checkout faster and easier.
                </p>

                {/* CTA (important) */}
              </div>
            ) : (
              <div className="space-y-2">
                {user_addresses.map((address) => (
                  <AddressRow
                    key={`address-row-${address.id}`}
                    address={address}
                    is_selected={address.id == address_id}
                    onClick={() => {
                      updateState?.({
                        address_id: address.id,
                      });
                      history.back();
                    }}
                    onDelete={(data) => {
                      delete_address_mutation.mutate({
                        address_id: data.id,
                      });
                    }}
                    onEdit={(data) => {
                      window.history.pushState({ address_modal: true }, "");
                      updateState?.({
                        is_modal_open: true,
                        data,
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 border-t border-gray-300 px-6 py-4 shadow-sm">
          <button
            className="w-full rounded-lg bg-orange-500 py-2 font-semibold text-white hover:bg-orange-600"
            onClick={() => {
              window.history.pushState({ address_modal: true }, "");
              updateState?.({
                is_modal_open: true,
              });
            }}
          >
            Add New Address
          </button>
        </div>
      </div>
    </SidebarDrawer>
  );
};

export default SelectAddressDrawer;
