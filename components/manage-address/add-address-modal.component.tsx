import { FC } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogTitle,
  DialogPanel,
  DialogBackdrop,
} from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { z } from "zod";

// helpers
import { toFormikValidate } from "@/helpers/common.helper";

export const address_schema = z.object({
  country: z.string(),
  fullName: z.string().min(1, "Full name is required"),
  address1: z.string().min(1, "Street address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip: z.string().min(4, "Zip code is required"),
  phone: z.string().min(8, "Phone number is required"),
  isDefault: z.boolean(),
});

type Props = {
  open: boolean;
  onClose: () => void;
};

const AddAddressModal: FC<Props> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      {/* Backdrop */}
      <DialogBackdrop className="fixed inset-0 bg-black/40" />

      {/* Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-300 px-6 py-4">
            <DialogTitle className="text-lg font-semibold">
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
              fullName: "",
              address1: "",
              address2: "",
              city: "",
              state: "",
              zip: "",
              phone: "",
              isDefault: false,
            }}
            validationSchema={toFormikValidate(address_schema)}
            onSubmit={(values) => {
              console.log(values);
              onClose();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Body */}
                <div className="max-h-[70vh] space-y-4 overflow-y-auto px-6 py-5">
                  {/* Autofill Banner */}
                  <div className="flex items-center justify-between rounded-lg border border-gray-300 bg-orange-50 px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">
                      Save time. Autofill your current location.
                    </p>

                    <button
                      type="button"
                      className="rounded-full border border-gray-300 px-4 py-1 text-sm hover:bg-gray-100"
                    >
                      Autofill
                    </button>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-sm font-medium">
                      Country / Region
                    </label>

                    <Field
                      as="select"
                      name="country"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    >
                      <option>India</option>
                    </Field>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-medium">Full name</label>

                    <Field
                      name="fullName"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <ErrorMessage
                      name="fullName"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-sm font-medium">
                      Street address
                    </label>

                    <Field
                      name="address1"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <Field
                      name="address2"
                      placeholder="Apartment, suite, unit, building"
                      className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <ErrorMessage
                      name="address1"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* City + Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">City</label>

                      <Field
                        name="city"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                      />

                      <ErrorMessage
                        name="city"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Zip Code</label>

                      <Field
                        name="zip"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                      />

                      <ErrorMessage
                        name="zip"
                        component="p"
                        className="text-sm text-red-500"
                      />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label className="text-sm font-medium">
                      State / Province
                    </label>

                    <Field
                      name="state"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <ErrorMessage
                      name="state"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium">Phone number</label>

                    <Field
                      name="phone"
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                    />

                    <p className="mt-1 text-xs text-gray-500">
                      May be used to assist delivery
                    </p>

                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>

                  {/* Default address */}
                  <label className="flex items-center gap-2">
                    <Field type="checkbox" name="isDefault" />
                    <span className="text-sm">Use as my default address</span>
                  </label>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-300 px-6 py-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-orange-500 px-6 py-2 font-medium text-white hover:bg-orange-600 disabled:opacity-50"
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
