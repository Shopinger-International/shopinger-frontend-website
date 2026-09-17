import { useEffect, useState } from "react";

// hooks
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";

// helpers
import { getUserLocation } from "@/helpers/address.helper";

const useDefaultLocationTooltipOpen = () => {
  const [default_open, setIsDefaultOpen] = useState<boolean>(false);
  const { selected_address, updateSelectedAddress } =
    useLocationTooltipStateContext();
  const { data: user_details } = useUserDetails();
  const { isPending: is_user_address_pending } = useUserAddresses();
  const { is_modal_open: is_login_modal_open } = useLoginModalContext();
  const { is_modal_open: is_address_modal_open } = useAddressDrawerContext();
  useEffect(() => {
    if (
      selected_address ||
      is_user_address_pending ||
      user_details?.user_addresses?.length
    )
      return;
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      if (result.state == "granted") {
        getUserLocation({
          handleSuccess(data) {
            updateSelectedAddress?.(data.area);
          },
          handleError() {
            setIsDefaultOpen(true);
          },
        });
      } else {
        setIsDefaultOpen(true);
      }
    });
  }, [selected_address, is_user_address_pending]);
  return {
    default_open:
      default_open && !is_login_modal_open && !is_address_modal_open,
    updateDefaultOpen: (val: boolean) => setIsDefaultOpen(val),
  };
};

export default useDefaultLocationTooltipOpen;
