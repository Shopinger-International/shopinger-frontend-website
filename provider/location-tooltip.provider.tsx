import { useContext, useState } from "react";
import { createContext } from "react";
// types
import type { ReactNode, FC } from "react";

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
  return (
    <LocationTooltipStateContext.Provider
      value={{
        selected_address,
        updateSelectedAddress(address) {
          setSelectedAddress(address);
        },
      }}
    >
      {children}
    </LocationTooltipStateContext.Provider>
  );
};
export default LocationTooltipStateProvider;
