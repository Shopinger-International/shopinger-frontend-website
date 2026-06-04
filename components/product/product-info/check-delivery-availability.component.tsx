import { AxiosError as AxiosErrorInstance } from "axios";
import { useState } from "react";
// types
import type {
  FC,
  ReactNode,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { LucideProps } from "lucide-react";

// external component
import { Formik, Form } from "formik";

// helpers
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";
import clsx from "clsx";

// hooks
import useVerifyPincodeServiceability from "@/hooks/axios/product/use-verify-pincode-serviceability.hook";

// icons
import { Truck, Banknote, MapPin } from "lucide-react";

export const delivery_pincode_schema = z.object({
  pincode: z
    .string()
    .trim()
    .min(1, "Pincode is required")
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
});
const DeliverZoneDataRenderer: FC<{
  children: ReactNode;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  iconClassName?: string;
}> = ({ children, icon: Icon, iconClassName }) => {
  return (
    <div className="flex items-start gap-2">
      <Icon className={clsx("mt-1 size-5", iconClassName)} aria-hidden={true} />
      <div className="flex-1">{children}</div>
    </div>
  );
};
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
                setDeliveryZoneData({
                  is_delivery_available: true,
                  cod_available: data.data.cod_available,
                  deliver_time_in_minutes: data.data.delivery_time_minutes,
                  delivery_fee: data.data.delivery_fee,
                });
              },
              onError(err) {
                if (err instanceof AxiosErrorInstance && err.status == 404) {
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
                    onChange={(e) => {
                      handleChange(e);
                      setDeliveryZoneData(null);
                    }}
                    inputMode="numeric"
                    required
                    aria-invalid={!!(touched["pincode"] && errors["pincode"])}
                    aria-describedby={
                      touched.pincode && errors.pincode
                        ? "pincode-error"
                        : undefined
                    }
                  />
                </div>
              }

              <button
                type="submit"
                className="cursor-pointer rounded-md bg-orange-500 px-3 py-1.5 font-medium text-white lg:py-2"
                aria-label="Check delivery availability for entered pincode"
                disabled={verify_pincode_serviceability_mutation.isPending}
              >
                {verify_pincode_serviceability_mutation.isPending
                  ? "Checking..."
                  : "Check"}
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
      <div aria-live="polite" className="sr-only">
        {delivery_zone_data
          ? delivery_zone_data.is_delivery_available
            ? `Delivery available. Estimated delivery in ${delivery_zone_data.deliver_time_in_minutes} minutes.`
            : "Delivery is not available for this pincode."
          : ""}
      </div>
      {delivery_zone_data && (
        <div
          aria-busy={verify_pincode_serviceability_mutation.isPending}
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
              <DeliverZoneDataRenderer
                icon={Truck}
                iconClassName="text-orange-500"
              >
                <>
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
                </>
              </DeliverZoneDataRenderer>

              {/* Cash on Delivery */}
              {delivery_zone_data.cod_available && (
                <DeliverZoneDataRenderer
                  icon={Banknote}
                  iconClassName="text-orange-500"
                >
                  <>
                    <h3 className="font-medium text-neutral-900">
                      Cash on Delivery
                    </h3>
                    <p className="mt-1 text-sm text-neutral-600">
                      Available for this order
                    </p>
                  </>
                </DeliverZoneDataRenderer>
              )}
              {/* Delivery Slot */}
              {/* <DeliverZoneDataRenderer
                icon={CalendarFold}
                iconClassName="text-orange-500"
              >
                <>
                  <h3 className="font-medium text-neutral-900">
                    Delivery Slot
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Choose your preferred time slot during checkout
                  </p>
                </>
              </DeliverZoneDataRenderer> */}
            </>
          ) : (
            <>
              <DeliverZoneDataRenderer
                icon={Truck}
                iconClassName="text-neutral-500"
              >
                <>
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
                </>
              </DeliverZoneDataRenderer>

              <DeliverZoneDataRenderer
                icon={MapPin}
                iconClassName="text-neutral-500"
              >
                <>
                  <h3 className="font-medium text-neutral-900">
                    Try Another Location
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Enter a different pincode to check availability.
                  </p>
                </>
              </DeliverZoneDataRenderer>
            </>
          )}
        </div>
      )}
    </section>
  );
};
export default CheckDeliveryAvailability;
