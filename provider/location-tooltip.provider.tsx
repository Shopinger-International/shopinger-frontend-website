import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode, FC } from "react";

import { SELECTED_ADDRESS } from "@/constants/common.constant";

type ILocationStateTooltip = {
  is_location_hydrated: boolean;
  is_shown: boolean;
  selected_address: string | null;
  vendor_id: number | null;
  distance: number | null;
  delivery_time: number | null;
  updateVendorId: (vendor_id: number) => void;
  updateSelectedAddress: (address: string) => void;
  updateIsShown: (val: boolean) => void;
  updateDeliveryTime: (time: number | null) => void;
  updateDistance: (distance: number | null) => void;
};

const LocationTooltipStateContext = createContext<ILocationStateTooltip>({
  is_location_hydrated: false,
  is_shown: false,
  selected_address: null,
  vendor_id: null,
  distance: null,
  delivery_time: null,
  updateVendorId: () => {},
  updateSelectedAddress: () => {},
  updateIsShown: () => {},
  updateDeliveryTime: () => {},
  updateDistance: () => {},
});

export const useLocationTooltipStateContext = () => {
  return useContext(LocationTooltipStateContext);
};

const LocationTooltipStateProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [is_location_hydrated, setIsLocationHydrated] = useState(false);
  const [is_shown, setIsShown] = useState(false);
  const [selected_address, setSelectedAddress] = useState<string | null>(null);
  const [vendor_id, setVendorId] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [delivery_time, setDeliveryTime] = useState<number | null>(
    !selected_address ? null : 15,
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const savedAddress = localStorage.getItem(SELECTED_ADDRESS);
      const savedVendorId = localStorage.getItem("vendor_id");
      const savedDistance = localStorage.getItem("distance");
      const savedDeliveryTime = localStorage.getItem("delivery_time");

      if (savedAddress) setSelectedAddress(savedAddress);

      if (savedVendorId) {
        const parsedVendorId = Number(savedVendorId);
        if (Number.isFinite(parsedVendorId) && parsedVendorId > 0) {
          setVendorId(parsedVendorId);
        }
      }

      if (savedDistance !== null) {
        const parsedDistance = Number(savedDistance);
        if (Number.isFinite(parsedDistance)) setDistance(parsedDistance);
      }

      if (savedDeliveryTime !== null) {
        const parsedTime = Number(savedDeliveryTime);
        if (Number.isFinite(parsedTime)) setDeliveryTime(parsedTime);
      }

      setIsLocationHydrated(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <LocationTooltipStateContext.Provider
      value={{
        is_location_hydrated,
        is_shown,
        selected_address,
        vendor_id,
        distance,
        delivery_time,

        updateVendorId(vendor_id) {
          localStorage.setItem("vendor_id", String(vendor_id));
          setVendorId(vendor_id);
        },

        updateSelectedAddress(address) {
          localStorage.setItem(SELECTED_ADDRESS, address);
          setSelectedAddress(address);
        },
        updateDeliveryTime(time) {
          if (time === null) {
            localStorage.removeItem("delivery_time");
          } else {
            localStorage.setItem("delivery_time", String(time));
          }

          setDeliveryTime(time);
        },
        updateDistance(distance) {
          localStorage.setItem("distance", String(distance));
          setDistance(distance);
        },

        updateIsShown(val) {
          setIsShown(val);
        },
      }}
    >
      {children}
    </LocationTooltipStateContext.Provider>
  );
};

export default LocationTooltipStateProvider;
