import { useState, useContext, createContext } from "react";
// types
import type { FC, ReactNode } from "react";
import type { IAddress } from "@/types/address";

// hooks
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";

export type IAddressDrawerState = {
  is_open: boolean;
  is_modal_open: boolean;
  address_id: number | null;
  updateState?: (
    payload: Partial<{
      is_open: boolean;
      is_modal_open: boolean;
      address_id: number | null;
      data: IAddress | null; // for storing updating related data
    }>,
  ) => void;
  data?: IAddress | null;
};

const AddressDrawerContext = createContext<IAddressDrawerState>({
  is_open: false,
  is_modal_open: false,
  address_id: null,
});

export const useAddressDrawerContext = () => {
  const data = useContext(AddressDrawerContext);
  return data;
};

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
    <AddressDrawerContext.Provider
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
    </AddressDrawerContext.Provider>
  );
};

export default SelectedAddressProvider;
