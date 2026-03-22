// types
import { FC } from "react";
import type { IPlace } from "@/types/address";

// icons
import { X, Home, Briefcase, MapPin } from "lucide-react";

// external components
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
  Fieldset,
  Legend,
} from "@headlessui/react";
import { Formik, Form } from "formik";

// local components
import AddAddressInput from "./add-address-input.component";
import LocationPicker from "@/components/common/location-picker/location-picker.component";
import SelectPlaces from "@/components/common/location-picker/select-places.component";

// helpers
import { toFormikValidate } from "@/helpers/common.helper";
import { z } from "zod";
import clsx from "clsx";
import axios from "axios";

const address_types = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "other", label: "Other", icon: MapPin },
];

const address_schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  house_number: z.string().min(1, "House / Flat No. is required"),

  landmark: z.string().optional(),
  address_type: z.enum(["home", "work", "other"]),
  delivery_instructions: z.string().optional(),
});

export type ICoords = {
  lat: number;
  lng: number;
};

const getAddressFromCoords = async (
  lat: number,
  lng: number,
): Promise<IPlace> => {
  const { data } = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.NEXT_PUBLIC_GEOCODING_API_KEY,
      },
    },
  );

  return data.results[0]; // most relevant result
};

const mapPlaceToForm = (place: IPlace) => {
  const getComp = (type: string) =>
    place.addressComponents.find((c) => c.types.includes(type))?.longText || "";

  // 1. Gather all "Small Area" components
  const neighborhood = getComp("neighborhood");
  const subLoc3 = getComp("sublocality_level_3");
  const subLoc2 = getComp("sublocality_level_2");
  const subLoc1 = getComp("sublocality_level_1");

  // 2. Create a "Smart" Address Line 1
  // We prioritize the most specific (neighborhood/level 3) first.
  // Using a Set prevents duplicates (sometimes Google puts the same name in two fields)
  const addressParts = Array.from(
    new Set([neighborhood, subLoc3, subLoc2, subLoc1]),
  ).filter(Boolean);

  const addressLine1 = addressParts.join(", ");

  return {
    place_id: place.id,
    formatted_address: place.formattedAddress,

    // If the combined parts are empty, use the full formatted string as a safe fallback
    address1: addressLine1 || place.formattedAddress,

    city: getComp("locality") || getComp("administrative_area_level_3"),
    state: getComp("administrative_area_level_1"),
    zip: getComp("postal_code"),

    latitude: place.location.latitude,
    longitude: place.location.longitude,
  };
};

const mapGeocodeToForm = (result: any) => {
  const getComp = (type: string) =>
    result.address_components.find((c: any) => c.types.includes(type))
      ?.long_name || "";

  // 1. Gather all "Small Area" components
  const neighborhood = getComp("neighborhood");
  const subLoc3 = getComp("sublocality_level_3");
  const subLoc2 = getComp("sublocality_level_2");
  const subLoc1 = getComp("sublocality_level_1");

  // 2. Same smart merging logic (your approach preserved)
  const addressParts = Array.from(
    new Set([neighborhood, subLoc3, subLoc2, subLoc1]),
  ).filter(Boolean);

  const addressLine1 = addressParts.join(", ");

  return {
    // ✅ Same keys as your original function
    place_id: result.place_id,
    formatted_address: result.formatted_address,

    address1: addressLine1 || result.formatted_address,

    city: getComp("locality") || getComp("administrative_area_level_3"),
    state: getComp("administrative_area_level_1"),
    zip: getComp("postal_code"),

    latitude: result.geometry.location.lat,
    longitude: result.geometry.location.lng,
  };
};

type IProps = {
  open: boolean;
  onClose: () => void;
};

const AddAddressModal: FC<IProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={() => {}} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 px-6 py-3">
            <DialogTitle className="text-lg font-semibold text-orange-500">
              Add new address
            </DialogTitle>

            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100"
            >
              <X size={18} />
            </button>
          </div>

          <Formik
            initialValues={{
              full_name: "",
              phone: "",

              house_number: "",
              landmark: "",

              place_id: "",
              formatted_address: "",
              address1: "",
              city: "",
              state: "",
              zip: "",

              latitude: 28.6139,
              longitude: 77.209,

              address_type: "home",
              delivery_instructions: "",
              is_default: false,
            }}
            validate={toFormikValidate(address_schema)}
            validateOnChange
            onSubmit={(values) => {
              console.log("Final Values:", values);
              onClose();
            }}
          >
            {({ values, setFieldValue, setValues, isSubmitting }) => (
              <Form>
                <div className="grid h-[60vh] grid-cols-2">
                  {/* LEFT: MAP */}
                  <div className="relative h-full border-r border-gray-300">
                    <div className="absolute top-6 z-10 w-full px-6">
                      <SelectPlaces
                        handleOnChange={(val) => {
                          const mapped = mapPlaceToForm(val.data);

                          setValues((prev) => ({
                            ...prev,
                            ...mapped,
                            latitude: val.data.location.latitude,
                            longitude: val.data.location.longitude,
                          }));
                        }}
                      />
                    </div>

                    <LocationPicker
                      position={{
                        lat: values.latitude,
                        lng: values.longitude,
                      }}
                      updatePosition={(coords) => {
                        setFieldValue("latitude", coords.lat);
                        setFieldValue("longitude", coords.lng);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          alert("Geolocation is not supported");
                          return;
                        }

                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const { latitude, longitude } = pos.coords;
                            getAddressFromCoords(latitude, longitude).then(
                              (data) => {
                                console.log("value fo data",data);
                                const mapped = mapGeocodeToForm(data);
                                setValues((prev) => ({
                                  ...prev,
                                  ...mapped,
                                }));
                              },
                            );
                          },
                          () => alert("Unable to fetch location"),
                        );
                      }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-orange-500 shadow-md"
                    >
                      📍 Use Current Location
                    </button>
                  </div>

                  {/* RIGHT: FORM */}
                  <div className="h-full space-y-6 overflow-y-auto p-6 py-4">
                    {/* Address Type */}
                    <Fieldset className="space-y-2">
                      <Legend className="text-sm font-medium">
                        Save Address as <span className="text-red-500">*</span>
                      </Legend>

                      <div className="flex gap-3">
                        {address_types.map(({ id, label, icon: Icon }) => {
                          const isActive = values.address_type === id;

                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setFieldValue("address_type", id)}
                              className={clsx(
                                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium",
                                isActive
                                  ? "border-orange-500 text-orange-600 ring-1 ring-orange-500"
                                  : "border-gray-300 text-gray-600",
                              )}
                            >
                              <Icon className="size-4" />
                              {label}
                            </button>
                          );
                        })}
                      </div>

                      <AddAddressInput
                        name="house_number"
                        placeholder="Flat / House No. *"
                      />

                      <AddAddressInput
                        name="landmark"
                        placeholder="Nearby landmark (optional)"
                      />

                      <AddAddressInput
                        name="address1"
                        placeholder="Area / Locality"
                        disabled
                      />
                    </Fieldset>

                    <Fieldset className="space-y-2">
                      <Legend className="text-sm font-medium">
                        Contact Details
                      </Legend>

                      <AddAddressInput
                        name="phone"
                        placeholder="Phone number"
                      />

                      <AddAddressInput
                        name="full_name"
                        placeholder="Full Name"
                      />
                    </Fieldset>

                    <Fieldset className="space-y-2">
                      <Legend className="text-sm font-medium">
                        Delivery Instructions
                      </Legend>

                      <AddAddressInput
                        name="delivery_instructions"
                        type="textarea"
                        placeholder="Eg. Call before delivery (Optional)"
                      />
                    </Fieldset>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-gray-300 px-6 py-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600"
                  >
                    {isSubmitting ? "Saving..." : "Add address"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default AddAddressModal;
