// types
import { FC } from "react";
import type { IPlace } from "@/types/address";

// icons
import { X } from "lucide-react";

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

// icons
import { Home, Briefcase, MapPin } from "lucide-react";

const address_types = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "other", label: "Other", icon: MapPin },
];

const address_schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"), // Improved validation
  building_name: z.string().min(1, "Flat/Building is required"),
  landmark: z.string().optional(),
  area: z.string().min(1, "Locality is required"),
  address_type: z.enum(["home", "work", "other"]),
  delivery_instructions: z.string().optional(),
});
export type ICoords = {
  lat: number;
  lng: number;
};
type Props = {
  open: boolean;
  onClose: () => void;
};
const mapPlaceToForm = (place: IPlace) => {
  const getComp = (type: string) =>
    place.addressComponents.find((c) => c.types.includes(type))?.longText || "";

  const city = getComp("locality") || getComp("administrative_area_level_3");

  const sublocality = getComp("sublocality_level_1");
  const addressLine1 = place.formattedAddress;

  return {
    address1: addressLine1,
    address2:
      sublocality === addressLine1
        ? getComp("sublocality_level_2")
        : sublocality,
    city: city,
    state: getComp("administrative_area_level_1"),
    zip: getComp("postal_code"),
    latitude: place.location.latitude,
    longitude: place.location.longitude,
  };
};
const AddAddressModal: FC<Props> = ({ open, onClose }) => {
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
              address1: "",
              address2: "",
              landmark: "",
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
                  <div className="sticky top-0 h-full space-y-3 border-r border-gray-300">
                    <div className="h-full">
                      <div className="absolute top-6 z-3 w-full px-6">
                        <SelectPlaces
                          handleOnChange={(val) => {
                            setValues((prev) => ({
                              ...prev,
                              ...val.data.location,
                              ...mapPlaceToForm(val.data),
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
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!navigator.geolocation) {
                          alert("Geolocation is not supported by your browser");
                          return;
                        }

                        navigator.geolocation.getCurrentPosition(
                          (pos) => {
                            const { latitude, longitude } = pos.coords;
                            setValues((prev) => ({
                              ...prev,
                              latitude,
                              longitude,
                            }));
                          },
                          (err) => {
                            console.error(err);
                            alert("Unable to fetch your location");
                          },
                        );
                      }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-semibold text-orange-500 shadow-md"
                    >
                      📍 Use Current Location
                    </button>
                  </div>

                  {/* RIGHT: FORM */}
                  <div className="h-full space-y-6 overflow-y-auto p-6 py-4">
                    <Fieldset className="space-y-2">
                      <Legend className={"text-sm font-medium"}>
                        Save Address as <span className="text-red-500">*</span>
                      </Legend>
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap gap-3">
                          {address_types.map(({ id, label, icon: Icon }) => {
                            const isActive = values.address_type === id;
                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() =>
                                  setFieldValue("address_type", id)
                                }
                                className={clsx(
                                  "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium",
                                  isActive
                                    ? "border-orange-500 text-orange-600 shadow-sm ring-1 ring-orange-500"
                                    : "border-gray-300 text-gray-600",
                                )}
                              >
                                <Icon
                                  className="size-4"
                                  strokeWidth={isActive ? 2.5 : 2}
                                />
                                {label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <AddAddressInput
                        name="building_name"
                        placeholder="Flat / House No. / Building Name *"
                      />
                      <AddAddressInput
                        name="landmark"
                        placeholder="Nearby landmark"
                      />

                      <AddAddressInput
                        name="address1"
                        placeholder="Area / Sector / Locality"
                        disabled={true}
                      />

                      {/* Address Type */}
                    </Fieldset>
                    <Fieldset className="space-y-2">
                      <Legend className={"text-sm font-medium"}>
                        Enter your details for seamless delivery experience
                      </Legend>
                      <AddAddressInput
                        name="phone"
                        placeholder="phone number"
                      />

                      <AddAddressInput
                        name="full_name"
                        placeholder="Your Name"
                      />
                    </Fieldset>

                    <Fieldset className={"space-y-2"}>
                      <Legend className={"text-sm font-medium"}>
                        Rider Instructions
                      </Legend>
                      <AddAddressInput
                        name="delivery_instructions"
                        type="textarea"
                        placeholder="Eg. Call before delivery"
                      />
                    </Fieldset>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-gray-300 px-6 py-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-orange-500 px-6 py-2 font-medium text-white shadow-sm hover:bg-orange-600 disabled:opacity-50"
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
