import { useContext, useState, useEffect } from "react";
import { createContext } from "react";
// types
import type { ReactNode, FC } from "react";

// const
import { SELECTED_ADDRESS } from "@/constants/common.constant";

type ILocationStateTooltip = {
  selected_address: string | null;
  updateSelectedAddress?: (address: string) => void;
};

const LocationTooltipStateContext = createContext<ILocationStateTooltip>({
  selected_address: null,
});

export const useLocationTooltipStateContext = () => {
  const data = useContext(LocationTooltipStateContext);
  return data;
};

const LocationTooltipStateProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const [selected_address, setSelectedAddress] = useState<string | null>(null);

  useEffect(() => {
    const selected_address = localStorage.getItem(SELECTED_ADDRESS);
    selected_address && setSelectedAddress(selected_address);
  }, []);
  return (
    <LocationTooltipStateContext.Provider
      value={{
        selected_address,
        updateSelectedAddress(address) {
          localStorage.setItem(SELECTED_ADDRESS, address);
          setSelectedAddress(address);
        },
      }}
    >
      {children}
    </LocationTooltipStateContext.Provider>
  );
};
export default LocationTooltipStateProvider;
