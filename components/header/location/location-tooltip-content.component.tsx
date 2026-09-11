import Image from "next/image";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";

// types
import type { FC } from "react";
import type { IPlace } from "@/types/address";

// icons
import {
  MapPin,
  Search,
  LocateFixed,
  ChevronRight,
  MapPinned,
} from "lucide-react";

// helpers
import { mapPlaceToForm } from "@/helpers/address.helper";

// hooks
import useVerifyPincodeServiceability from "@/hooks/axios/product/use-verify-pincode-serviceability.hook";
import { useLocationTooltipStateContext } from "@/provider/location-tooltip.provider";
import useUserAddresses from "@/hooks/axios/address/use-user-addresses.hook";
import { useAddressDrawerContext } from "@/provider/selected-address-provider.component";
import useUserDetails from "@/hooks/axios/common/use-user-details.hook";
import { useLoginModalContext } from "@/provider/login-modal-provider";

// API
import { fetchPlaces } from "@/components/common/map/location-picker/select-places.component";
import { getUserLocation } from "@/helpers/address.helper";

type IOptionType = {
  label: string;
  value: string;
  data: IPlace;
};

const LocationTooltipContent: FC<{
  handleClose: () => void;
}> = ({ handleClose }) => {
  const [location_access_enabled, setLocationAccessEnabled] = useState(true);
  const current_location_subtitle_ref = useRef<HTMLParagraphElement>(null);
  const { updateSelectedAddress } = useLocationTooltipStateContext();
  const { openModal: openAddressModal, updateState } =
    useAddressDrawerContext();
  const { openModal: openLoginModal } = useLoginModalContext();
  const { data: user_details, isPending } = useUserDetails();
  const input_ref = useRef<HTMLInputElement>(null);
  const [is_delivery_unavailable, setIsDeliveryUnavailable] = useState(false);
  const timeout_ref = useRef<NodeJS.Timeout | null>(null);
  const [is_locating, setIsLocating] = useState(false);

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<IOptionType[]>([]);
  const [is_loading, setIsLoading] = useState(false);
  const { data: user_addresses = [] } = useUserAddresses();

  const verify_pincode_serviceability_mutation =
    useVerifyPincodeServiceability();

  const handleSearch = (value: string) => {
    setQuery(value);

    if (timeout_ref.current) {
      clearTimeout(timeout_ref.current);
    }

    if (!value.trim()) {
      setOptions([]);
      return;
    }

    timeout_ref.current = setTimeout(async () => {
      try {
        setIsLoading(true);

        const places = await fetchPlaces(value);

        setOptions(
          places?.map((place) => ({
            label: place.formattedAddress,
            value: place.formattedAddress,
            data: place,
          })),
        );
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const handleSelect = (option: IOptionType) => {
    const mapped = mapPlaceToForm(option.data);

    verify_pincode_serviceability_mutation
      .mutateAsync({
        pin_code: mapped.pincode,
      })
      .then((data) => {
        updateSelectedAddress?.(mapped.area);
        handleClose();
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          const data = err.response?.data;
          console.log("value of err data", data);
          setIsDeliveryUnavailable(!data.is_serviceable);
        }
      });

    setQuery("");
    setOptions([]);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported");
      return;
    }
    setIsLocating(true);
    getUserLocation({
      handleSuccess(mapped) {
        verify_pincode_serviceability_mutation.mutate(
          {
            pin_code: mapped.pincode,
          },
          {
            onSuccess() {
              updateSelectedAddress?.(mapped.area);
              handleClose();
            },
            onError(err) {
              setIsDeliveryUnavailable(true);
            },
            onSettled() {
              setIsLocating(false);
            },
          },
        );
      },
      handleError() {
        alert("Unable to fetch location");
        setIsLocating(false);
      },
    });
  };

  useEffect(() => {
    let is_mounted = true;
    let status_obj: PermissionStatus | null = null;

    const updatePermissionState = (status: PermissionStatus) => {
      if (!current_location_subtitle_ref.current) return;
      setLocationAccessEnabled(
        status.state == "prompt" || status.state == "granted",
      );
    };

    const handleStateChange = (event: Event) => {
      updatePermissionState(event.target as PermissionStatus);
    };

    navigator.permissions?.query({ name: "geolocation" }).then((status) => {
      // If the component already unmounted before the promise resolved, abort
      if (!is_mounted) return;

      status_obj = status;
      updatePermissionState(status_obj);
      status_obj.addEventListener("change", handleStateChange);
    });

    return () => {
      is_mounted = false;
      if (status_obj) {
        status_obj.removeEventListener("change", handleStateChange);
      }
    };
  }, []);

  return (
    <div className="h-full w-full">
      {/* Search */}
      <div className="overflow-y-auto border-b border-gray-300 p-2.5">
        <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 sm:px-4 sm:py-2">
          <Search className="size-5 shrink-0 text-gray-400" />

          <input
            ref={input_ref}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search area, city or PIN code"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="h-[calc(100%-63px)] overflow-y-auto bg-gray-100 p-2.5">
        {!query.trim() &&
          !is_delivery_unavailable &&
          (location_access_enabled ? (
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={is_locating}
              className="mb-2.5 flex w-full items-center gap-3 rounded-md bg-white px-3 py-2.5 text-left transition-colors hover:bg-orange-50"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                <LocateFixed className="size-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-500">
                  {is_locating
                    ? "Detecting location..."
                    : "Use current location"}
                </p>
                <p
                  ref={current_location_subtitle_ref}
                  className="text-xs text-gray-600"
                >
                  Get accurate availability and delivery time
                </p>
              </div>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="mb-2.5 flex w-full cursor-not-allowed items-center gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-left"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-red-100">
                <LocateFixed className="size-4 text-red-500" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800">
                  Use current location
                </p>

                <p className="mt-0.5 text-xs leading-4 text-gray-600">
                  Location access is blocked. Enable it in your browser
                  settings.
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold text-red-600">
                Blocked
              </span>
            </button>
          ))}
        {/* Delivery unavailable */}
        {is_delivery_unavailable && !query.length ? (
          <div className="flex h-full flex-col justify-center space-y-4 rounded-md bg-white p-6 text-center">
            <div className="relative mx-auto flex size-60 shrink-0 items-center justify-center">
              <Image
                src="/not-available-at-location.png"
                fill={true}
                alt="not-available"
                className="object-contain"
              />
            </div>

            {/* Centered Content */}
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-gray-900">Sorry !</p>
              <p className="text-lg font-semibold text-gray-900">
                Shopinger is not available in your area
              </p>
              <p className="text-gray-500">Coming soon</p>
            </div>

            {/* Button */}
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOptions([]);
                setIsDeliveryUnavailable(false);
                input_ref.current?.focus();
              }}
              className="flex h-9 w-full shrink-0 items-center justify-center rounded-md bg-orange-500 px-3 font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Choose another location
            </button>
          </div>
        ) : (
          <>
            {(is_loading || options?.length > 0) && (
              <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
                {is_loading ? (
                  <div className="px-3 py-3 text-sm text-gray-600">
                    Searching locations...
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {options.map((option) => (
                      <button
                        key={option.data.id}
                        type="button"
                        onClick={() => handleSelect(option)}
                        className="flex w-full items-start gap-2.5 border-b border-gray-300 px-3 py-3 text-left transition-colors last:border-b-0 hover:bg-orange-100"
                      >
                        <MapPin className="mt-0.5 size-4 shrink-0" />

                        <span className="min-w-0 text-sm font-medium text-gray-600">
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {!is_loading &&
              query.trim() &&
              (!options || options?.length === 0) && (
                <div className="mt-2 rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-600">
                  No locations found
                </div>
              )}
            {!query.trim().length && (
              <div className="overflow-hidden rounded-md bg-white">
                <div className="px-3 py-2.5">
                  <p className="text-xs font-semibold tracking-wide text-gray-600 uppercase">
                    Saved addresses
                  </p>
                </div>

                {!user_details && !isPending ? (
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                      <MapPin className="size-3.5" />
                    </div>
                    <p className="min-w-0 flex-1 text-sm text-gray-500">
                      <button
                        type="button"
                        onClick={() => {
                          openLoginModal({
                            is_modal: true,
                            title: "Login for better experience",
                            onCancel() {},
                          });
                        }}
                        className="cursor-pointer font-semibold text-orange-500 underline hover:text-orange-600"
                      >
                        Login
                      </button>{" "}
                      to see your saved addresses.
                    </p>
                  </div>
                ) : !!user_addresses.length ? (
                  <div>
                    {user_addresses.map((address) => (
                      <button
                        key={address.id}
                        type="button"
                        onClick={() => {
                          updateState?.({
                            address_id: address.id,
                          });
                          updateSelectedAddress?.(
                            `${address.house_number ?? ""}${address.house_number ? "," : ""} ${address.area}`,
                          );
                          handleClose();
                        }}
                        className="group flex w-full items-center gap-3 border-b border-gray-300 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-orange-50"
                      >
                        <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors group-hover:bg-orange-50 group-hover:text-orange-500">
                          <MapPin className="size-3.5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-600">
                            {address.formatted_address}
                          </p>
                        </div>

                        <ChevronRight className="size-4 shrink-0 text-gray-600 transition-colors group-hover:text-orange-500" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <div className="flex size-7.5 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                      <MapPin className="size-3.5" />
                    </div>

                    <p className="min-w-0 flex-1 text-xs text-gray-500">
                      No saved addresses yet
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        openAddressModal();
                      }}
                      className="shrink-0 text-xs font-semibold text-orange-500 hover:text-orange-600"
                    >
                      Add address
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocationTooltipContent;
