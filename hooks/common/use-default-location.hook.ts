import { useEffect, useState } from "react";

// hooks
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import useVerifyPincodeServiceability from "@/hooks/axios/product/use-verify-pincode-serviceability.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";

// helpers
import { getUserLocation } from "@/helpers/address.helper";

const useDefaultLocationTooltipOpen = () => {
  const [default_open, setIsDefaultOpen] = useState(false);

  const {
    is_shown,
    selected_address,
    updateSelectedAddress,
    updateVendorId,
    updateDeliveryTime,
    updateDistance,
  } = useLocationTooltipStateContext();

  const { data: user_details } = useUserDetails();
  const { isPending: is_user_address_pending } = useUserAddresses();
  const { is_modal_open: is_login_modal_open } = useLoginModalContext();
  const { is_modal_open: is_address_modal_open } = useAddressDrawerContext();

  const serviceabilityMutation = useVerifyPincodeServiceability();

  useEffect(() => {
    if (
      selected_address ||
      is_user_address_pending ||
      is_shown ||
      user_details?.user_addresses?.length
    ) {
      return;
    }

    let cancelled = false;

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (cancelled) return;

        if (result.state === "granted") {
          getUserLocation({
            async handleSuccess(coords, address) {
              try {
                const response = await serviceabilityMutation.mutateAsync({
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                });

                if (cancelled) return;

                updateSelectedAddress(address.area);
                updateVendorId(response.data.vendor_id);
                updateDeliveryTime(response.data.delivery_time_minutes);
                updateDistance(response.data.distance_km);
              } catch (error) {
                if (!cancelled) setIsDefaultOpen(true);
              }
            },

            handleError() {
              if (!cancelled) setIsDefaultOpen(true);
            },
          });
        } else {
          setIsDefaultOpen(true);
        }
      })
      .catch(() => {
        if (!cancelled) setIsDefaultOpen(true);
      });

    return () => {
      cancelled = true;
    };
  }, [
    selected_address,
    is_user_address_pending,
    is_shown,
    user_details?.user_addresses?.length,
  ]);

  return {
    default_open:
      default_open && !is_login_modal_open && !is_address_modal_open,
    updateDefaultOpen: setIsDefaultOpen,
  };
};

export default useDefaultLocationTooltipOpen;
