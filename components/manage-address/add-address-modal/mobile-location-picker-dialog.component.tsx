import { useState } from "react";
// types
import { FC } from "react";

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

// local
import AddAddressInput from "@/components/manage-address/add-address-modal/add-address-input.component";
import LocationPicker from "@/components/common/location-picker/location-picker.component";
import SelectPlaces from "@/components/common/location-picker/select-places.component";

// helpers
import clsx from "clsx";
import {
  mapPlaceToForm,
  mapGeocodeToForm,
  getAddressFromCoords,
} from "@/helpers/address.helper";

const address_types = [
  { id: "home", label: "Home", icon: Home },
  { id: "work", label: "Work", icon: Briefcase },
  { id: "other", label: "Other", icon: MapPin },
];

const MobileAddressModal: FC<{ open: boolean; onClose: () => void }> = ({
  open,
  onClose,
}) => {
  const [show_drawer, setShowDrawer] = useState(false);
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0">
        <DialogPanel className="h-full w-full bg-white">
          <div className="flex items-center justify-between border-b border-gray-300 px-4 py-2">
            <DialogTitle className="font-semibold text-orange-500">
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
            onSubmit={(values) => {
              console.log(values);
              onClose();
              setShowDrawer(false);
            }}
          >
            {({ values, isSubmitting, setFieldValue, setValues }) => (
              <Form className="h-full">
                <div className="relative h-full w-full">
                  {/* MAP */}
                  <div className="absolute inset-0">
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

                  {/* SEARCH */}
                  <div className="absolute top-4 z-20 w-full px-4">
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

                  {/* CURRENT LOCATION */}
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
                              console.log("value fo data", data);
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
                    className="absolute bottom-36 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-orange-500 shadow-sm"
                  >
                    <MapPin
                      className="size-3.5 text-orange-500"
                      strokeWidth={2.5}
                    />
                    <span>Use Current Location</span>
                  </button>
                  <div className="fixed bottom-0 z-30 w-full border-t border-gray-300 bg-white p-4 shadow-sm">
                    <button
                      type="button"
                      className="w-full rounded-md bg-orange-500 py-2 font-semibold text-white shadow-sm"
                      onClick={() => setShowDrawer(true)}
                    >
                      Confirm & Proceed
                    </button>
                  </div>

                  {/* DRAWER */}
                  {show_drawer && (
                    <>
                      <div
                        className="fixed bottom-0 z-30 h-screen w-screen bg-transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDrawer(false);
                        }}
                      />
                      <div className="fixed bottom-0 z-40 w-full rounded-t-2xl border border-gray-300 bg-white shadow-xl">
                        <div className="relative p-4">
                          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300" />
                          {/* Close CTA */}
                          <button
                            type="button"
                            onClick={() => setShowDrawer(false)}
                            className="absolute top-3 right-3 rounded-full p-2 text-gray-500 hover:bg-gray-100"
                          >
                            <X className="size-5" />
                          </button>
                          <Fieldset className="space-y-3">
                            <Legend className="text-sm font-medium">
                              Save Address as
                            </Legend>

                            <div className="flex gap-2">
                              {address_types.map(
                                ({ id, label, icon: Icon }) => {
                                  const isActive = values.address_type === id;
                                  return (
                                    <button
                                      key={id}
                                      type="button"
                                      onClick={() =>
                                        setFieldValue("address_type", id)
                                      }
                                      className={clsx(
                                        "flex items-center gap-2 rounded-lg border px-3 py-1 text-sm",
                                        isActive
                                          ? "border-orange-500 text-orange-500"
                                          : "border-gray-300",
                                      )}
                                    >
                                      <Icon className="size-4" />
                                      {label}
                                    </button>
                                  );
                                },
                              )}
                            </div>

                            <AddAddressInput
                              name="house_number"
                              placeholder="House No."
                            />
                            <AddAddressInput
                              name="landmark"
                              placeholder="Landmark"
                            />
                            <AddAddressInput
                              name="address1"
                              placeholder="Area"
                            />
                            <AddAddressInput name="phone" placeholder="Phone" />
                            <AddAddressInput
                              name="full_name"
                              placeholder="Full Name"
                            />
                          </Fieldset>
                        </div>
                        <div className="shrink-0 space-y-2 border-t border-gray-300 p-4">
                          {/* Selected Location Hint */}
                          {values.formatted_address ? (
                            <p className="text-sm leading-snug font-semibold">
                              {values.formatted_address}
                            </p>
                          ) : (
                            <div className="text-xs text-gray-400">
                              Select a location on map to continue
                            </div>
                          )}

                          {/* Submit Button */}
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-md bg-orange-500 px-6 py-2 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                          >
                            {isSubmitting ? "Saving..." : "Add address"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MobileAddressModal;
