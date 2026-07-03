import { useState } from "react";
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
  const default_address_id = user_addresses.find(
    (address) => address.is_default == true,
  )?.id;
  if (default_address_id && !address_drawer_state.address_id) {
    setAddressDrawerState({
      ...address_drawer_state,
      address_id: default_address_id,
    });
  }

  return (
    <AddressDrawerState.Provider
      value={{
        ...address_drawer_state,
        updateState: (payload) => {
          setAddressDrawerState((prev) => ({
            ...prev,
            ...payload,
          }));
        },
      }}
    >
      {children}
    </AddressDrawerState.Provider>
  );
};

export default SelectedAddressProvider;
