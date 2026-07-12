import { useRouter } from "next/router";
import { useState, useContext, createContext } from "react";
// types
import type { FC, ReactNode } from "react";
import type { IAddress } from "@/types/address";

// hooks
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import useUIHistory from "@/hooks/common/use-ui-history.hook";
import useIsMounted from "@/hooks/common/use-is-mounted.hook";

export type IAddressDrawerState = {
  address_id: number | null;
  updateState?: (
    payload: Partial<{
      address_id: number | null;
      data: IAddress | null; // for storing updating related data
    }>,
  ) => void;
  data?: IAddress | null;
};

const AddressDrawerContext = createContext<IAddressDrawerState>({
  address_id: null,
});

export const useAddressDrawerContext = () => {
  const router = useRouter();
  const is_mounted = useIsMounted();
  const data = useContext(AddressDrawerContext);
  const is_drawer_open = is_mounted && router.query.address_drawer === "1";
  const is_modal_open = is_mounted && router.query.address_modal === "1";
  const { open, close } = useUIHistory();
  return {
    is_drawer_open,
    is_modal_open,
    openDrawer: () => open({ address_drawer: "1" }),
    closeDrawer: close,
    openModal: () => open({ address_modal: "1" }),
    closeModal: close,
    ...data,
  };
};

const SelectedAddressProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [address_drawer_state, setAddressDrawerState] = useState<
    Omit<IAddressDrawerState, "updateState">
  >({
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
