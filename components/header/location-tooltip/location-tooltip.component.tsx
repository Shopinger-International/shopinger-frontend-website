import { useEffect, useState } from "react";
// types
import type { FC } from "react";

// hooks
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";

// helpers
import clsx from "clsx";

// icons
import { ChevronRight, MapPin } from "lucide-react";

// local components
import Tooltip from "@/components/common/tooltip.component";
import LocationTooltipContent from "@/components/header/location-tooltip/location-tooltip-content.component";

const LocationTooltip: FC<{
  className: string;
}> = ({ className }) => {
  const { selected_address } = useLocationTooltipStateContext();
  const { is_modal_open: is_login_modal_open } = useLoginModalContext();
  const [default_open, setIsDefaultOpen] = useState(false);
  const { address_id, is_modal_open: is_address_modal_open } =
    useAddressDrawerContext();
  const { data: user_details } = useUserDetails();
  const { data: user_addresses, isPending: is_user_address_pending } =
    useUserAddresses();

  const user_address = user_addresses?.find(
    (address) => address.id == address_id,
  );

  const delivery_time = user_details ? "45" : "10";

  const user_selected_address = (function () {
    if (selected_address) return selected_address;
    if (user_address) {
      return user_address.house_number
        ? `${user_address.house_number}, ${user_address.area}`
        : user_address.area;
    }
    return;
  })();

  useEffect(() => {
    if (user_selected_address || is_user_address_pending) return;
    setIsDefaultOpen(true);
  }, [user_selected_address, is_user_address_pending]);

  return (
    <Tooltip
      placement="bottom-start"
      trigger="click"
      toggle={!default_open}
      offset_distance={12}
      default_open={
        default_open && !is_login_modal_open && !is_address_modal_open
      }
      className={clsx(
        "z-50 w-3/4 rounded-xl border border-gray-300 bg-white shadow-lg sm:w-100",
      )}
      strategy="fixed"
      static_offset={20}
      show_overlay={!user_selected_address}
      content={({ handleClose }) => (
        <LocationTooltipContent
          handleClose={() => {
            setIsDefaultOpen(false);
            handleClose();
          }}
        />
      )}
    >
      {() => (
        <div className={clsx("min-w-0 items-center text-white", className)}>
          {/* ================= MOBILE ================= */}
          <div className="flex w-full min-w-0 items-center gap-2 lg:hidden">
            {/* Location */}
            <div className="flex min-w-0 flex-1 items-center gap-1">
              <MapPin
                aria-hidden={true}
                className="size-3 shrink-0 text-white"
              />

              <span className="min-w-0 truncate text-sm">
                {user_selected_address ?? "Choose delivery location"}
              </span>
              {/* Arrow */}
              <ChevronRight className="size-4 shrink-0" aria-hidden={true} />
            </div>

            {/* Delivery */}
            <div className="flex shrink-0 items-center gap-1">
              <div>
                <span className="text-[11px] font-semibold whitespace-nowrap">
                  Delivery in
                </span>
                <div className="flex flex-row items-center gap-1">
                  <span className="flex gap-1 rounded-md bg-[#FF6900] px-2 py-1 text-[10px] font-bold whitespace-nowrap text-white">
                    {delivery_time} MIN
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= DESKTOP ================= */}
          <div className="hidden lg:flex lg:flex-col lg:items-start">
            {/* Delivery time */}
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold">Delivery in</span>

              <span
                className={clsx(
                  "inline-block rounded-md bg-[#FF6900] px-2 py-0.5 text-sm font-semibold text-white transition-transform duration-100",
                )}
              >
                <span className="flex items-center gap-1">
                  {delivery_time} MIN
                </span>
              </span>
            </div>

            {/* Location */}
            {user_selected_address ? (
              <div className="mt-0.5 flex w-full max-w-xs items-center gap-1 text-left text-xs">
                <MapPin
                  aria-hidden={true}
                  className="size-3 shrink-0 text-white"
                />

                <span className="max-w-44 truncate">
                  {user_selected_address}
                </span>
              </div>
            ) : (
              <span className="mt-0.5 text-xs">Add your location</span>
            )}
          </div>
        </div>
      )}
    </Tooltip>
  );
};

export default LocationTooltip;
