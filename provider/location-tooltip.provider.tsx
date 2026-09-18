import { useContext, useState, useEffect } from "react";
import { createContext } from "react";
// types
import type { ReactNode, FC } from "react";

// const
import { SELECTED_ADDRESS } from "@/constants/common.constant";

type ILocationStateTooltip = {
  is_shown: boolean; // remove it when, location modal would be shown till user don't provide his location
  selected_address: string | null;
  updateSelectedAddress?: (address: string) => void;
  updateIsShown?: (val: boolean) => void;
};

const LocationTooltipStateContext = createContext<ILocationStateTooltip>({
  is_shown: false,
  selected_address: null,
});

export const useLocationTooltipStateContext = () => {
  const data = useContext(LocationTooltipStateContext);
  return data;
};

const LocationTooltipStateProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [is_shown, setIsShown] = useState(false);
  const [selected_address, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const selected_address = localStorage.getItem(SELECTED_ADDRESS);
    selected_address && setSelectedAddress(selected_address);
  }, []);
  return (
    <LocationTooltipStateContext.Provider
      value={{
        is_shown,
        selected_address,
        updateSelectedAddress(address) {
          localStorage.setItem(SELECTED_ADDRESS, address);
          setSelectedAddress(address);
        },
        updateIsShown(val: boolean) {
          setIsShown(val);
        },
      }}
    >
      {children}
    </LocationTooltipStateContext.Provider>
  );
};
export default LocationTooltipStateProvider;
