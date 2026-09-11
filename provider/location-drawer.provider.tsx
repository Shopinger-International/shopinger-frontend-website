import { createContext, useState, useContext } from "react";
// types
import type { FC, ReactNode } from "react";

// local components
import LocationDrawer from "@/components/header/location/location-drawer.component";

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
  const [is_drawer_open, setIsDrawerOpen] = useState(false);
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
        open={is_drawer_open}
        onClose={() => setIsDrawerOpen(false)}
      />
      {children}
    </LocationDrawerContext.Provider>
  );
};
export default LocationDrawerProvider;
