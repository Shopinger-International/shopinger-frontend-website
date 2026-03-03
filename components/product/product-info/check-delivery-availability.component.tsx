import { useState } from "react";
// types
import type { FC } from "react";
import type { AxiosError } from "axios";

// external component
import { Formik, Form } from "formik";

// helpers
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";
import clsx from "clsx";

// hooks
import useVerifyPincodeServiceability from "@/hooks/axios/product/use-verify-pincode-serviceability.hook";

// icons
import { Truck, CalendarFold } from "lucide-react";

export const delivery_pincode_schema = z.object({
  pincode: z
    .string()
    .trim()
    .min(1, "Pincode is required")
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
});

const CheckDeliveryAvailability: FC = () => {
  const [delivery_zone_data, setDeliveryZoneData] = useState<{
    is_delivery_available: boolean;
    cod_available: boolean;
    deliver_time_in_minutes: number;
    delivery_fee: number;
  } | null>(null);
  const verify_pincode_serviceability_mutation =
    useVerifyPincodeServiceability();
  return (
    <section
      aria-labelledby="delivery-heading"
      className="order-7 mb-4 space-y-2 lg:space-y-3"
    >
      <h2 id="delivery-heading" className="text-sm font-medium lg:text-base">
        Check Delivery Availability
      </h2>
      <Formik
        onSubmit={(values) => {
          console.log("value of values", values);
          verify_pincode_serviceability_mutation.mutate(
            {
              pin_code: values.pincode,
            },
            {
              onSuccess(data) {
                console.log("value of data", data);
                setDeliveryZoneData({
                  is_delivery_available: true,
                  cod_available: data.data.cod_available,
                  deliver_time_in_minutes: data.data.delivery_time_minutes,
                  delivery_fee: data.data.delivery_fee,
                });
              },
              onError(err: AxiosError) {
                if (err.status == 404) {
                  setDeliveryZoneData({
                    is_delivery_available: false,
                    cod_available: false,
                    deliver_time_in_minutes: 0,
                    delivery_fee: 0,
                  });
                  return;
                }
                setDeliveryZoneData(null);
              },
            },
          );
        }}
        validate={toFormikValidate(delivery_pincode_schema)}
        initialValues={{
          pincode: "",
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <div className="space-y-1.5">
            <Form
              onSubmit={handleSubmit}
              className="flex w-full items-center gap-2"
            >
              <label htmlFor="pincode" className="sr-only" aria-hidden="true">
                Enter delivery pincode
              </label>

              {
                <div className="flex-1">
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={values["pincode"]}
                    className={clsx(
                      "w-full rounded-md border px-3 py-1.5 text-sm lg:px-4 lg:py-2 lg:text-base",
                      touched["pincode"] && errors["pincode"]
                        ? "border-2 border-red-600"
                        : "border border-gray-300",
                    )}
                    placeholder="Enter pincode"
                    onChange={handleChange}
                    inputMode="numeric"
                    required
                    aria-invalid={!!(touched["pincode"] && errors["pincode"])}
                    aria-describedby={"pincode-error"}
                  />
                </div>
              }

              <button
                type="submit"
                className="cursor-pointer rounded-md bg-orange-500 px-3 py-1.5 font-medium text-white lg:py-2"
              >
                Check
              </button>
            </Form>
            {touched.pincode && errors.pincode && (
              <p id="pincode-error" className="text-red-600">
                {errors.pincode}
              </p>
            )}
          </div>
        )}
      </Formik>
      {delivery_zone_data && (
        <div
          className={clsx(
            "w-full space-y-4 rounded-lg p-5",
            delivery_zone_data.is_delivery_available
              ? "border border-orange-200 bg-orange-50"
              : "border border-gray-200 bg-gray-50",
          )}
        >
          {delivery_zone_data.is_delivery_available ? (
            <>
              {/* Express Delivery */}
              <div className="flex items-start gap-2">
                <Truck className="mt-1 size-5 text-orange-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900">
                      Express Delivery
                    </h3>
                    {!Number(delivery_zone_data.delivery_fee) && (
                      <span className="font-medium text-orange-600">Free</span>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-neutral-600">
                    Delivery within{" "}
                    <span className="font-medium text-neutral-900">
                      {delivery_zone_data.deliver_time_in_minutes} min
                    </span>
                  </p>
                </div>
              </div>

              {/* Delivery Slot */}
              <div className="flex items-start gap-2">
                <CalendarFold className="mt-1 size-5 text-orange-500" />
                <div>
                  <h3 className="font-medium text-neutral-900">
                    Delivery Slot
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Choose your preferred time slot during checkout
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Status */}
              <div className="flex items-start gap-2">
                <Truck className="mt-1 size-5 text-neutral-500" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-neutral-900">
                      Delivery Status
                    </h3>
                    <span className="font-medium text-neutral-600">
                      Not Available
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-neutral-600">
                    This product is currently not deliverable to your selected
                    location.
                  </p>
                </div>
              </div>

              {/* Optional recovery */}
              <div className="flex items-start gap-2">
                <CalendarFold className="mt-1 size-5 text-neutral-500" />
                <div>
                  <h3 className="font-medium text-neutral-900">
                    Try Another Location
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Enter a different pincode to check availability.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
};
export default CheckDeliveryAvailability;
