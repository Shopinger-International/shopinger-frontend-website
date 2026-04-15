import { useState, useEffect } from "react";
// types
import type { FC, ReactNode } from "react";
import type { IAddressDrawerState } from "@/context";

// context
import { AddressDrawerState } from "@/context";

// hooks
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";

const SelectedAddressProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [address_drawer_state, setAddressDrawerState] = useState<
    Omit<IAddressDrawerState, "updateState">
  >({
    is_open: false,
    is_modal_open: false,
    address_id: null,
  });
  const { data: user_addresses = [] } = useUserAddresses();

  useEffect(() => {
    if (user_addresses.length) {
      const default_address = user_addresses.find(
        (address) => address.is_default == true,
      );

      const selected_address = user_addresses.find(
        (address) => address.id == address_drawer_state.address_id,
      );
      setAddressDrawerState((prev) => ({
        ...prev,
        address_id: selected_address?.id ?? default_address?.id ?? null,
      }));
    }
  }, [user_addresses.length, address_drawer_state.address_id]);
  return (
    <AddressDrawerState.Provider
      value={{
        ...address_drawer_state,
        updateState: ({ open, is_modal_open, address_id }) =>
          setAddressDrawerState({
            is_open: open,
            is_modal_open,
            address_id,
          }),
      }}
    >
      {children}
    </AddressDrawerState.Provider>
  );
};

export default SelectedAddressProvider;
