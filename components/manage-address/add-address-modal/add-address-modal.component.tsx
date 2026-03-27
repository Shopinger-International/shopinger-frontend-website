// types
import { FC } from "react";
import type { IAddress } from "@/types/address";

// icons
import { X, Home, Briefcase, MapPin } from "lucide-react";

// external components
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  Fieldset,
  Legend,
} from "@headlessui/react";
import { Formik, Form } from "formik";

// local components
import AddAddressInput from "@/components/manage-address/add-address-modal/add-address-input.component";
import LocationPicker from "@/components/common/location-picker/location-picker.component";
import SelectPlaces from "@/components/common/location-picker/select-places.component";
import Switch from "@/components/common/switch.component";

// helpers
import { toFormikValidate } from "@/helpers/common.helper";
import {
  mapPlaceToForm,
  mapGeocodeToForm,
  getAddressFromCoords,
} from "@/helpers/address.helper";
import { z } from "zod";
import clsx from "clsx";

// hooks
import useCreateAddressMutation from "@/hooks/axios/address/use-create-address-mutation.hook";
import useUpdateAddressMutation from "@/hooks/axios/address/use-update-address-mutation.hook";

// const
import { ADDRESS_TYPE } from "@/constants/display-area.constant";

const address_types = [
  { id: ADDRESS_TYPE.HOME, label: "Home", icon: Home },
  { id: ADDRESS_TYPE.WORK, label: "Work", icon: Briefcase },
  { id: ADDRESS_TYPE.OTHER, label: "Other", icon: MapPin },
];

const address_schema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),

  house_number: z.string().min(1, "House / Flat No. is required"),

  landmark: z.string().optional(),
  address_type: z.enum([
    ADDRESS_TYPE.HOME,
    ADDRESS_TYPE.WORK,
    ADDRESS_TYPE.OTHER,
  ]),
  delivery_instructions: z.string().optional(),
});

export type IFormAddressType = Omit<
  IAddress,
  "id" | "user_id" | "is_deleted" | "latitude" | "longitude"
> & {
  latitude: number | null;
  longitude: number | null;
};
export type ICoords = {
  lat: number;
  lng: number;
};

type IProps = {
  open: boolean;
  initial_data?: IAddress | null;
  onClose: () => void;
  handleOnSuccess?: (data: IAddress) => void;
};

const AddAddressModal: FC<IProps> = ({
  open,
  initial_data,
  onClose,
  handleOnSuccess,
}) => {
  const create_address_mutation = useCreateAddressMutation();
  const update_address_mutation = useUpdateAddressMutation();
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-xl">
          <Formik<IFormAddressType>
            initialValues={
              initial_data ?? {
                full_name: "",
                phone: "",
                house_number: "",
                landmark: "",
                place_id: "",
                formatted_address: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                latitude: null,
                longitude: null,
                address_type: ADDRESS_TYPE.HOME,
                delivery_instructions: "",
                is_default: false,
              }
            }
            validate={toFormikValidate(address_schema)}
            onSubmit={(values) => {
              initial_data
                ? update_address_mutation.mutate(
                    {
                      address_id: initial_data.id,
                      payload: values,
                    },
                    {
                      onSuccess({ data }) {
                        onClose();
                        handleOnSuccess?.(data);
                      },
                    },
                  )
                : create_address_mutation.mutate(
                    {
                      ...values,
                    },
                    {
                      onSuccess({ data }) {
                        onClose();
                        handleOnSuccess?.(data);
                      },
                    },
                  );
            }}
          >
            {({ values, setFieldValue, setValues }) => (
              <Form className="flex h-[80vh] max-h-150 flex-col">
                {/* BODY */}

                <div className="flex flex-1 overflow-hidden">
                  {/* LEFT - MAP */}
                  <div className="relative w-1/2 border-r border-gray-300">
                    {/* Search */}
                    <div className="absolute top-4 right-0 left-0 z-10 px-4">
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

                    {/* Map */}
                    <div className="h-full w-full">
                      <LocationPicker
                        position={{
                          lat: values.latitude,
                          lng: values.longitude,
                        }}
                        updatePosition={(coords) => {
                          setValues((prev) => ({
                            ...prev,
                            latitude: coords.lat,
                            longitude: coords.lng,
                          }));
                        }}
                      />
                    </div>

                    {/* Current location button */}
                    <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2">
                      <button
                        type="button"
                        className="flex items-center gap-1 rounded-full border bg-white px-3 py-1.5 text-sm font-semibold text-orange-500 shadow-sm"
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
                      >
                        <MapPin className="size-3.5" />
                        Use Current Location
                      </button>
                    </div>
                  </div>

                  {/* RIGHT - FORM */}
                  <div className="flex w-1/2 flex-col">
                    {/* RIGHT HEADER ONLY */}
                    <div className="flex shrink-0 items-center justify-between border-b border-gray-300 px-6 py-3">
                      <h2 className="text-lg font-semibold text-orange-500">
                        {initial_data ? "Update Address" : "Add new address"}
                      </h2>

                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 hover:bg-gray-100"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    {/* SCROLLABLE FORM */}
                    <div className="flex-1 space-y-6 overflow-y-auto px-6 py-4">
                      {/* Address Type */}
                      <Fieldset className="space-y-2">
                        <Legend className="text-sm font-medium">
                          Save Address as{" "}
                          <span className="text-red-500">*</span>
                        </Legend>

                        <div className="flex gap-3">
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
                          name="area"
                          placeholder="Area / Locality"
                          disabled
                        />
                      </Fieldset>

                      {/* Contact */}
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

                      {/* Instructions */}
                      <Fieldset className="space-y-2">
                        <Legend className="text-sm font-medium">
                          Delivery Instructions
                        </Legend>

                        <AddAddressInput
                          name="delivery_instructions"
                          type="textarea"
                          placeholder="Eg. Call before delivery (Optional)"
                        />

                        <Switch
                          label="Set as default address"
                          description="This will be used for all future orders by default"
                          name="is_default"
                        />
                      </Fieldset>
                    </div>

                    {/* FOOTER */}
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
                        disabled={
                          create_address_mutation.isPending ||
                          update_address_mutation.isPending
                        }
                        className="w-full rounded-md bg-orange-500 px-6 py-2 font-semibold text-white shadow-sm hover:bg-orange-600 disabled:opacity-60"
                      >
                        {update_address_mutation.isPending
                          ? "Updating..."
                          : create_address_mutation.isPending
                            ? "Saving..."
                            : initial_data
                              ? "Update Address"
                              : "Add Address"}
                      </button>
                    </div>
                  </div>
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
