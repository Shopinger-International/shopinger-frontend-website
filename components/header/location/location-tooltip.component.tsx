// types
import type { FC } from "react";

// hooks
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";
import { useLoginModalContext } from "@/provider/login-modal-provider";
import useIsMobile from "@/hooks/common/use-is-mobile.hook";
import { useLocationDrawerContext } from "@/provider/location-drawer.provider";
import useDefaultLocationTooltipOpen from "@/hooks/common/use-default-location.hook";

// helpers
import clsx from "clsx";

// icons
import { ChevronDown, MapPin } from "lucide-react";

// local components
import Tooltip from "@/components/common/tooltip.component";
import LocationTooltipContent from "@/components/header/location/location-tooltip-content.component";

const LocationTooltip: FC<{
  className: string;
}> = ({ className }) => {
  const is_mobile = useIsMobile();
  const { selected_address } = useLocationTooltipStateContext();
  const { updateState: updateLocationDrawerState } = useLocationDrawerContext();
  const { is_modal_open: is_login_modal_open } = useLoginModalContext();
  const { is_modal_open: is_address_modal_open } = useAddressDrawerContext();
  const { data: user_details } = useUserDetails();
  const { default_open, updateDefaultOpen } = useDefaultLocationTooltipOpen();

  const delivery_time = user_details ? "45" : "10";

  if (is_mobile) {
    return (
      <div className={clsx("min-w-0 items-center text-white", className)}>
        {/* ================= MOBILE ================= */}
        <div className="flex w-full min-w-0 items-center gap-2 lg:hidden">
          {/* Location */}
          <button
            onClick={() => updateLocationDrawerState?.(true)}
            className="flex min-w-0 flex-1 items-center gap-1"
          >
            <MapPin aria-hidden={true} className="size-3 shrink-0 text-white" />

            <span className="min-w-0 truncate text-sm">
              {selected_address ?? "Choose delivery location"}
            </span>
            {/* Arrow */}
            <ChevronDown className="size-4 shrink-0" aria-hidden={true} />
          </button>

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
          {selected_address ? (
            <div className="mt-0.5 flex w-full max-w-xs items-center gap-1 text-left text-xs">
              <MapPin
                aria-hidden={true}
                className="size-3 shrink-0 text-white"
              />

              <span className="max-w-44 truncate">{selected_address}</span>
            </div>
          ) : (
            <span className="mt-0.5 text-xs">Add your location</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Tooltip
      placement="bottom-start"
      trigger="click"
      toggle={!default_open}
      offset_distance={12}
      default_open={default_open}
      className={clsx(
        "z-50 w-3/4 rounded-xl border border-gray-300 bg-white shadow-lg sm:w-100",
      )}
      show_tooltip={!is_login_modal_open && !is_address_modal_open}
      strategy="fixed"
      static_offset={20}
      show_overlay={!selected_address}
      content={({ handleClose }) => (
        <LocationTooltipContent
          handleClose={() => {
            updateDefaultOpen(false);
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
                {selected_address ?? "Choose delivery location"}
              </span>
              {/* Arrow */}
              <ChevronDown className="size-4 shrink-0" aria-hidden={true} />
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
            <div className="flex items-center">
              {selected_address ? (
                <div className="mt-0.5 flex w-full max-w-xs items-center gap-1 text-left text-xs">
                  <MapPin
                    aria-hidden={true}
                    className="size-3 shrink-0 text-white"
                  />

                  <span className="max-w-44 truncate">{selected_address}</span>
                </div>
              ) : (
                <span className="mt-0.5 text-xs">Add your location</span>
              )}
              <ChevronDown className="size-4 shrink-0" aria-hidden={true} />
            </div>
          </div>
        </div>
      )}
    </Tooltip>
  );
};

export default LocationTooltip;
