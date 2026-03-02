import type { FC } from "react";

// external component
import { Formik, Form } from "formik";

// icons
import { AlertCircle } from "lucide-react";

// helpers
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";
import clsx from "clsx";
import Tooltip from "@/components/common/tooltip.component";

// hooks
import useVerifyPincodeServiceability from "@/hooks/axios/product/use-verify-pincode-serviceability.hook";

export const delivery_pincode_schema = z.object({
  pincode: z
    .string()
    .trim()
    .min(1, "Pincode is required")
    .regex(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode"),
});

const CheckDeliveryAvailability: FC = () => {
  const verify_pincode_serviceability_mutation =
    useVerifyPincodeServiceability();
  return (
    <section
      aria-labelledby="delivery-heading"
      className="mb-4 flex items-center gap-2"
    >
      <h2 id="delivery-heading" className="inline text-sm font-medium">
        Check Delivery Availability
      </h2>
      <Formik
        onSubmit={(values) => {
          console.log("value of values", values);
          verify_pincode_serviceability_mutation.mutate({
            pin_code: values.pincode,
          });
        }}
        validate={toFormikValidate(delivery_pincode_schema)}
        initialValues={{
          pincode: "",
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="flex items-center gap-2">
            <label htmlFor="pincode" className="sr-only" aria-hidden="true">
              Enter delivery pincode
            </label>

            {
              <Tooltip
                content={
                  <div className="flex items-start gap-2 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 shadow-md">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                    <span>{errors["pincode"]}</span>
                  </div>
                }
                className=""
                show_tooltip={!!(touched["pincode"] && errors["pincode"])}
                placement="top"
              >
                {({ open }) => (
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    value={values["pincode"]}
                    className={clsx(
                      "rounded-md border px-4 py-2 text-xs font-medium",
                      touched["pincode"] && errors["pincode"]
                        ? "border-2 border-red-600"
                        : "border border-orange-500",
                    )}
                    placeholder="Enter pincode"
                    onChange={handleChange}
                    inputMode="numeric"
                    required
                    aria-invalid={!!(touched["pincode"] && errors["pincode"])}
                    aria-describedby={"pincode-error"}
                  />
                )}
              </Tooltip>
            }
            {touched.pincode && errors.pincode && (
              <p id="pincode-error" className="sr-only">
                {errors.pincode}
              </p>
            )}
            <button
              type="submit"
              className="cursor-pointer text-sm font-medium text-orange-500"
            >
              Check
            </button>
          </Form>
        )}
      </Formik>
    </section>
  );
};
export default CheckDeliveryAvailability;
