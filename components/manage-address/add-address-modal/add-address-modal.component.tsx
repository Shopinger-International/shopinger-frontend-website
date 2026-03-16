import { FC } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { Formik, Form } from "formik";
import { z } from "zod";

// helpers
import { toFormikValidate } from "@/helpers/common.helper";

// local components
import AddAddressInput from "./add-address-input.component";

// icons
import { MapPin } from "lucide-react";

export const address_schema = z.object({
  country: z.string(),

  full_name: z.string().min(1, "Full name is required"),

  phone: z.string().min(10, "Phone number must be at least 10 digits"),

  address1: z.string().min(1, "Street address is required"),

  address2: z.string().optional(),

  landmark: z.string().optional(),

  city: z.string().min(1, "City is required"),

  state: z.string().min(1, "State is required"),

  zip: z.string().min(4, "Zip code is required"),

  latitude: z.number().optional(),

  longitude: z.number().optional(),

  address_type: z.enum(["home", "work", "other"]),

  delivery_instructions: z.string().optional(),

  is_default: z.boolean(),
});

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddAddressModal: FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
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
              country: "India",
              full_name: "",
              phone: "",
              address1: "",
              address2: "",
              landmark: "",
              city: "",
              state: "",
              zip: "",
              address_type: "home",
              delivery_instructions: "",
              is_default: false,
            }}
            validate={toFormikValidate(address_schema)}
            onSubmit={(values) => {
              console.log(values);
              onClose();
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                {/* Body */}
                {/* Body */}
                <div className="max-h-[70vh] space-y-5 overflow-y-auto px-6 py-6">
                  {/* Location button */}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        setFieldValue("latitude", pos.coords.latitude);
                        setFieldValue("longitude", pos.coords.longitude);
                      });
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 py-3 text-sm text-gray-600 hover:bg-gray-100"
                  >
                    <MapPin size={16} />
                    Use current location
                  </button>

                  <AddAddressInput
                    name="country"
                    label="Country / Region"
                    type="text"
                    disabled
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <AddAddressInput
                      name="phone"
                      label="Phone number"
                      placeholder="Enter phone number"
                    />

                    <AddAddressInput
                      name="full_name"
                      label="Full name"
                      placeholder="Enter full name"
                    />
                  </div>

                  <AddAddressInput
                    name="address1"
                    label="Street address"
                    placeholder="House no, street name"
                  />

                  <AddAddressInput
                    name="address2"
                    label="Apartment / Suite / Building"
                    placeholder="Apartment, suite, building"
                  />

                  <AddAddressInput
                    name="landmark"
                    label="Landmark"
                    placeholder="Nearby landmark"
                  />

                  <div className="grid grid-cols-3 gap-4">
                    <AddAddressInput
                      name="city"
                      label="City"
                      placeholder="Enter city"
                    />

                    <AddAddressInput
                      name="state"
                      label="State"
                      placeholder="Enter state"
                    />

                    <AddAddressInput
                      name="zip"
                      label="Zip code"
                      placeholder="Enter ZIP / PIN code"
                    />
                  </div>

                  {/* Address Type */}
                  <div className="space-y-2">
                    <label className="font-medium text-gray-700">
                      Address type
                    </label>

                    <div className="flex gap-3">
                      {["home", "work", "other"].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFieldValue("address_type", type)}
                          className={`rounded-lg border px-4 py-2 text-sm capitalize transition ${
                            values.address_type === type
                              ? "border-orange-500 bg-orange-50 text-orange-600"
                              : "border-gray-300 hover:bg-gray-100"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AddAddressInput
                    name="delivery_instructions"
                    label="Delivery instructions"
                    type="textarea"
                    placeholder="Eg. Call before delivery"
                  />

                  <AddAddressInput
                    name="is_default"
                    label="Use as my default address"
                    type="checkbox"
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-end border-t border-gray-300 px-6 py-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-md bg-orange-500 px-6 py-2 font-medium text-white shadow-sm hover:bg-orange-600 disabled:opacity-50"
                  >
                    Add address
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
