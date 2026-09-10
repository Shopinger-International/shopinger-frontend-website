import { AxiosError } from "axios";
import { useRef, useState } from "react";

// types
import type { FC } from "react";
import type { IPlace } from "@/types/address";

// icons
import { MapPin, Search, MapPinned, LocateFixed } from "lucide-react";

// helpers
import {
  mapPlaceToForm,
  getAddressFromCoords,
  mapGeocodeToForm,
} from "@/helpers/address.helper";

// hooks
import useVerifyPincodeServiceability from "@/hooks/axios/product/use-verify-pincode-serviceability.hook";

// API
import { fetchPlaces } from "@/components/common/map/location-picker/select-places.component";

type IOptionType = {
  label: string;
  value: string;
  data: IPlace;
};

const LocationTooltipContent: FC<{
  handleClose: () => void;
}> = ({ handleClose }) => {
  const [is_focused, setIsFocused] = useState(false);
  const input_ref = useRef<HTMLInputElement>(null);
  const [is_delivery_unavailable, setIsDeliveryUnavailable] = useState(false);
  const timeout_ref = useRef<NodeJS.Timeout | null>(null);
  const [is_locating, setIsLocating] = useState(false);

  const [query, setQuery] = useState("");
  const [options, setOptions] = useState<IOptionType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        getAddressFromCoords(latitude, longitude).then((data) => {
          const mapped = mapGeocodeToForm(data);
          verify_pincode_serviceability_mutation.mutate(
            {
              pin_code: mapped.pincode,
            },
            {
              onSuccess() {
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
        });
      },
      () => {
        alert("Unable to fetch location");
        setIsLocating(false);
      },
    );
  };

  console.log(
    "value of test",
    !isLoading && query.trim() && options?.length === 0,
    !isLoading,
    query.trim(),
    options,
  );

  return (
    <div className="w-full">
      {/* Search */}
      <div className="border-b border-gray-300 p-2.5">
        <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2.5 focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500 sm:px-4 sm:py-2">
          <Search className="size-5 shrink-0 text-gray-400" />

          <input
            ref={input_ref}
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search location..."
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="bg-gray-100 p-2.5">
        {!query.trim() && !is_delivery_unavailable && (
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={is_locating}
            className="mb-2.5 flex w-full items-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-left transition-colors hover:bg-orange-50"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-500">
              <LocateFixed className="size-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-orange-500">
                {is_locating ? "Detecting location..." : "Use current location"}
              </p>
              <p className="text-xs text-gray-600">
                Enable current location for better experience
              </p>
            </div>
          </button>
        )}
        {/* Delivery unavailable */}
        {!is_focused && is_delivery_unavailable ? (
          <div className="rounded-md border border-gray-300 bg-white p-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-50">
                <MapPinned className="size-4.5 text-orange-500" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                  Delivery isn’t available here
                </p>

                <p className="mt-0.5 text-xs leading-4 font-medium text-gray-600">
                  We’re not delivering to this area yet.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOptions([]);
                setIsDeliveryUnavailable(false);
                input_ref.current?.focus();
              }}
              className="mt-3 flex h-9 w-full items-center justify-center rounded-md bg-orange-500 px-3 text-xs font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Change location
            </button>
          </div>
        ) : (
          <>
            {(isLoading || options?.length > 0) && (
              <div className="overflow-hidden rounded-md border border-gray-300 bg-white">
                {isLoading ? (
                  <div className="px-3 py-3 text-sm text-gray-600">
                    Searching locations...
                  </div>
                ) : (
                  <div className="max-h-80 overflow-y-auto">
                    {options.map((option) => (
                      <button
                        key={option.value}
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

            {!isLoading &&
              query.trim() &&
              (!options || options?.length === 0) && (
                <div className="mt-2 rounded-md border border-gray-300 px-3 py-3 text-sm text-gray-600">
                  No locations found
                </div>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default LocationTooltipContent;
