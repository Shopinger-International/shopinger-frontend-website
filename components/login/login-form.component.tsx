import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
// types
import type { FC } from "react";
import type { FieldProps } from "formik";
import type { Country } from "@/data/countries.data";
import type { CountryCode } from "libphonenumber-js";

// external components
import { Formik, Form, Field } from "formik";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Field as HeadlessField, Label } from "@headlessui/react";

// local components
import CountrySelector from "@/components/login/country-selector.component";
import OTPInput from "@/components/common/otp-input.component";

// helpers
import { z } from "zod";
import {
  toFormikValidate,
  startsWithNumber,
  getCallingCode,
} from "@/helpers/common.helper";
import clsx from "clsx";

import { parsePhoneNumberFromString } from "libphonenumber-js";

// data
import { countries } from "@/data/countries.data";

// icons
import { ChevronDown } from "lucide-react";

// hooks
import useSendOTPMutation from "@/hooks/axios/login/use-send-otp-mutation";
import useVerifyLoginOtp from "@/hooks/axios/login/verify-login-otp-mutation";

export type IInitialValues = {
  contact: string;
  country: Country | undefined;
};

const initial_values = {
  contact: "",
  country: countries.find(({ name }) => name == "India"),
};

export const login_validation_schema = z
  .object({
    contact: z.string().trim(),
    country: z
      .object({
        code: z.string(), // "IN", "US"
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { contact, country } = data;

    const is_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);

    const is_digit_only = /^\d+$/.test(contact);

    // ✅ Email
    if (is_email) return;

    // ✅ Phone with country
    if (is_digit_only && country) {
      const phone = parsePhoneNumberFromString(
        contact,
        country.code as CountryCode,
      );

      if (!phone?.isValid()) {
        ctx.addIssue({
          path: ["contact"],
          message: "Enter a valid phone number",
          code: "custom",
        });
      }
      return;
    }

    // ❌ Neither email nor phone
    ctx.addIssue({
      path: ["contact"],
      message: "Enter a valid phone number or email",
      code: "custom",
    });
  });

const LoginForm: FC = () => {
  const send_otp_mutation = useSendOTPMutation();
  const verify_otp_mutation = useVerifyLoginOtp();
  const router = useRouter();
  const [show_otp, setShowOtp] = useState<boolean>(false);
  const [otp_val, setOtpVal] = useState("");
  const [user_details, setUserDetails] =
    useState<IInitialValues>(initial_values);
  return (
    <div className="relative flex min-h-155 w-full flex-col items-center space-y-4 bg-white px-6 lg:w-max lg:min-w-108 lg:px-12">
      <div className="relative mt-40 flex size-20 shrink-0 items-center justify-center lg:mt-30">
        <Image
          src="/dark-mobile-logo.jpg"
          alt="Shopinger – Online Shopping Platform"
          fill
          priority
          className="object-contain"
        />
      </div>
      {/* Heading */}
      <h2 className="text-2xl font-bold">Login or Sign Up</h2>

      {!show_otp ? (
        <Formik<IInitialValues>
          initialValues={initial_values}
          validate={toFormikValidate(login_validation_schema)}
          onSubmit={(values) => {
            setUserDetails(values);
            send_otp_mutation.mutate(
              { phone: values.contact },
              {
                onSuccess() {
                  setShowOtp(true);
                },
              },
            );
          }}
        >
          {({ values, errors, setFieldValue, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="w-full space-y-4">
              <Field name="contact">
                {({ field, meta }: FieldProps<string, IInitialValues>) => (
                  <div className="space-y-2">
                    <label
                      htmlFor="contact"
                      className="text-md block font-medium text-gray-700"
                    >
                      Enter mobile number or email
                    </label>
                    <div className="flex items-center gap-1">
                      {startsWithNumber(field.value) && (
                        <Popover className="relative">
                          <PopoverButton className="flex h-10 items-center gap-1 rounded-l-md border border-gray-400 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none">
                            {getCallingCode(
                              values.country?.code as CountryCode,
                            )}
                            <ChevronDown className="size-4" />
                          </PopoverButton>

                          <PopoverPanel className="absolute z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="max-h-64 overflow-y-auto p-2">
                              <CountrySelector />
                            </div>
                          </PopoverPanel>
                        </Popover>
                      )}

                      <input
                        id="contact"
                        type="text"
                        placeholder="Mobile number or email"
                        className={clsx(
                          "h-10 w-full rounded-r-md border border-gray-400 px-3 hover:outline-orange-500",
                          startsWithNumber(field.value)
                            ? "rounded-r-md"
                            : "rounded-md",
                        )}
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.toLowerCase();
                          setFieldValue(field.name, value);
                        }}
                      />
                    </div>
                    {meta.touched && meta.error && (
                      <p className="text-red-500">{meta.error}</p>
                    )}
                  </div>
                )}
              </Field>
              <button
                onClick={() => console.log(errors)}
                className="w-full cursor-pointer rounded-md bg-orange-500 py-2 font-bold text-white shadow-sm hover:bg-orange-600 disabled:bg-orange-300"
                disabled={send_otp_mutation.isPending}
                type="submit"
              >
                Get OTP
              </button>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="space-y-4">
          <HeadlessField>
            <Label>
              Enter OTP Sent on{" "}
              {startsWithNumber(user_details.contact) &&
                getCallingCode(user_details.country?.code as CountryCode)}{" "}
              {user_details.contact}
            </Label>

            <OTPInput
              value={otp_val}
              onChange={(val) => {
                console.log("value of otp", val);
                if (/^\d*$/.test(val)) {
                  setOtpVal(val);
                }
              }}
              maxLength={6}
              containerClassName="flex gap-2"
            />
          </HeadlessField>
          <button
            disabled={verify_otp_mutation.isPending}
            onClick={() => {
              verify_otp_mutation.mutate(
                {
                  mobile: user_details.contact,
                  otp: otp_val,
                },
                {
                  onSuccess() {
                    router.push("/");
                  },
                },
              );
            }}
            className="w-full cursor-pointer rounded-md bg-orange-500 py-2 font-bold text-white shadow-sm hover:bg-orange-600 disabled:bg-orange-300"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};
export default LoginForm;
