import { createContext, useState, useContext } from "react";
// types
import type { FC, ReactNode } from "react";

// local components
import LocationDrawer from "@/components/header/location/location-drawer.component";
import useDefaultLocationTooltipOpen from "@/hooks/common/use-default-location.hook";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import useIsMounted from "@/hooks/common/use-is-mounted.hook";
import { useLocationTooltipStateContext } from "./location-tooltip.provider";

type ILocationDrawerContext = {
  is_drawer_open: boolean;
  updateState?: (val: boolean) => void;
};
const LocationDrawerContext = createContext<ILocationDrawerContext>({
  is_drawer_open: false,
});

export const useLocationDrawerContext = () => {
  const data = useContext(LocationDrawerContext);
  return data;
};

const LocationDrawerProvider: FC<{
  children: ReactNode;
}> = ({ children }) => {
  const is_mounted = useIsMounted();
  const is_mobile = useIsMobile();
  const { default_open, updateDefaultOpen } = useDefaultLocationTooltipOpen();
  const { selected_address } = useLocationTooltipStateContext();

  const [is_drawer_open, setIsDrawerOpen] = useState(true);
  if (is_mobile && is_mounted) {
    return (
      <LocationDrawerContext.Provider
        value={{
          is_drawer_open,
          updateState(val) {
            setIsDrawerOpen(val);
          },
        }}
      >
        <LocationDrawer
          toggle={!default_open}
          open={selected_address ? false : default_open || is_drawer_open}
          onClose={() => {
            updateDefaultOpen(false);
            setIsDrawerOpen(false);
          }}
        />
        {children}
      </LocationDrawerContext.Provider>
    );
  }
  return <>{children}</>;
};
export default LocationDrawerProvider;
