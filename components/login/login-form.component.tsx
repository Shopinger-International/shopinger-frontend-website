import Link from "next/link";
import { useState, useEffect } from "react";
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

// local components
import CountrySelector from "@/components/login/country-selector.component";
import OTPInput from "@/components/common/otp-input.component";

// helpers
import { z } from "zod";
import {
  toFormikValidate,
  startsWithNumber,
  getCallingCode,
  formatSeconds,
} from "@/helpers/common.helper";
import clsx from "clsx";
import { parsePhoneNumberFromString } from "libphonenumber-js";

// data
import { countries } from "@/data/countries.data";

// icons
import { ChevronDown } from "lucide-react";

// hooks
import useSendOTPMutation from "@/hooks/axios/login/send-otp-mutation.hook";
import useVerifyLoginOtp from "@/hooks/axios/login/verify-login-otp-mutation";

export type IInitialValues = {
  identifier: string;
  country: Country | undefined;
};

const initial_values = {
  identifier: "",
  country: countries.find(({ name }) => name == "India"),
};

const login_validation_schema = z
  .object({
    identifier: z.string().trim(),
    country: z
      .object({
        code: z.string(), // "IN", "US"
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    const { identifier, country } = data;

    const is_email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

    const is_digit_only = /^\d+$/.test(identifier);

    // ✅ Email
    if (is_email) return;

    // ✅ Phone with country
    if (is_digit_only && country) {
      const phone = parsePhoneNumberFromString(
        identifier,
        country.code as CountryCode,
      );

      if (!phone?.isValid()) {
        ctx.addIssue({
          path: ["identifier"],
          message: "Enter a valid phone number",
          code: "custom",
        });
      }
      return;
    }

    // ❌ Neither email nor phone
    ctx.addIssue({
      path: ["identifier"],
      message: "Enter a valid phone number or email",
      code: "custom",
    });
  });

const otp_schema = z.object({
  otp: z
    .string()
    .min(1, "OTP is required")
    .regex(/^\d+$/, "OTP must contain only numbers")
    .length(6, "OTP must be exactly 6 digits"),
});

type IProps = {
  is_modal?: boolean;
  heading_text?: string;
  handleOnSuccess?: () => void;
};

const LoginForm: FC<IProps> = ({
  is_modal = false,
  heading_text,
  handleOnSuccess,
}) => {
  const send_otp_mutation = useSendOTPMutation();
  const verify_otp_mutation = useVerifyLoginOtp();
  const router = useRouter();
  const [show_otp, setShowOtp] = useState<boolean>(false);
  const [user_details, setUserDetails] =
    useState<IInitialValues>(initial_values);
  const [timer, setTimer] = useState(60);

  // countdown
  useEffect(() => {
    if (timer <= 0 || !show_otp) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, show_otp]);
  return (
    <div
      className={clsx(
        "relative flex w-full flex-col items-center space-y-3 bg-white",
        is_modal
          ? "px-6 py-6"
          : "min-h-136 px-6 lg:w-max lg:min-w-108 lg:px-12",
      )}
    >
      {!is_modal && (
        <button
          onClick={() => router.push("/")}
          className="text-md absolute top-6 right-6 inline-block font-semibold text-orange-500 lg:hidden"
        >
          SKIP
        </button>
      )}
      {!is_modal && (
        <div
          className={clsx(
            "relative flex size-20 shrink-0 items-center justify-center",
            is_modal ? "mt-4" : "mt-40 lg:mt-20",
          )}
        >
          <Image
            src="/dark-mobile-logo.png"
            alt="Shopinger – Online Shopping Platform"
            fill
            priority
            className="object-contain"
          />
        </div>
      )}

      {/* Heading */}
      <h2
        className={clsx(
          is_modal
            ? "w-full text-left text-lg font-semibold"
            : "text-xl font-bold",
        )}
      >
        {heading_text ?? "Login or Sign Up"}
      </h2>

      {!show_otp ? (
        <Formik<IInitialValues>
          initialValues={user_details}
          validate={toFormikValidate(login_validation_schema)}
          onSubmit={(values) => {
            send_otp_mutation.mutate(
              {
                identifier: values.identifier,
                country_code: user_details.country?.code
                  ? getCallingCode(user_details.country.code as CountryCode)
                  : undefined,
              },
              {
                onSuccess(response) {
                  setUserDetails(values);
                  setShowOtp(true);
                },
              },
            );
          }}
        >
          {({ values, errors, setFieldValue, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="w-full space-y-4">
              <Field name="identifier">
                {({ field, meta }: FieldProps<string, IInitialValues>) => (
                  <div className="space-y-2">
                    <label
                      htmlFor="identifier"
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
                        id="identifier"
                        type="text"
                        placeholder="Mobile number or email"
                        className={clsx(
                          "h-10 w-full rounded-r-md border border-gray-300 px-3 hover:outline-orange-500 focus:outline-orange-500",
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
                className="h-10 w-full cursor-pointer rounded-md bg-orange-500 font-bold text-white shadow-sm hover:bg-orange-600 disabled:bg-orange-300"
                disabled={send_otp_mutation.isPending}
                type="submit"
              >
                Get OTP
              </button>
              <p className="-mt-1 text-center text-sm font-medium">
                I agree to{" "}
                <Link href="/" className="text-orange-500">
                  T&C
                </Link>{" "}
                and{" "}
                <Link href="/" className="text-orange-500">
                  Privacy Policy
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          <Formik
            initialValues={{
              otp: "",
            }}
            validate={toFormikValidate(otp_schema)}
            onSubmit={(values) => {
              verify_otp_mutation.mutate(
                {
                  identifier: user_details.identifier,
                  otp: values.otp,
                  country_code: user_details.country?.code
                    ? getCallingCode(user_details.country.code as CountryCode)
                    : undefined,
                },
                {
                  onSuccess() {
                    !is_modal && router.push("/");
                    handleOnSuccess?.();
                  },
                },
              );
            }}
          >
            {({ setFieldValue, handleSubmit, resetForm }) => (
              <Form onSubmit={handleSubmit} className="w-full space-y-3">
                <Field name="otp">
                  {({ field, meta }: FieldProps<string, IInitialValues>) => (
                    <>
                      <label className="flex items-center justify-between text-sm font-medium">
                        <span>
                          OTP Sent on{" "}
                          {startsWithNumber(user_details.identifier) &&
                            getCallingCode(
                              user_details.country?.code as CountryCode,
                            )}{" "}
                          {user_details.identifier}
                        </span>{" "}
                        <button
                          type="button"
                          onClick={() => {
                            setShowOtp(false);
                            setTimer(60);
                          }}
                          className="flex cursor-pointer items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
                        >
                          Change
                        </button>
                      </label>

                      <OTPInput
                        {...field}
                        onChange={(val) => {
                          if (/^\d*$/.test(val)) {
                            setFieldValue(field.name, val);
                          }
                        }}
                        maxLength={6}
                        containerClassName="flex gap-2"
                      />
                      {meta.touched && meta.error && (
                        <p className="text-red-500">{meta.error}</p>
                      )}
                    </>
                  )}
                </Field>
                <button
                  type="submit"
                  disabled={verify_otp_mutation.isPending}
                  className="w-full cursor-pointer rounded-md bg-orange-500 py-2 font-bold text-white shadow-sm hover:bg-orange-600 disabled:bg-orange-300"
                >
                  Continue
                </button>
                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    Didn't receive OTP?
                  </span>{" "}
                  <button
                    type="button"
                    disabled={timer > 0}
                    onClick={() => {
                      send_otp_mutation.mutate(
                        {
                          identifier: user_details.identifier,
                          country_code: user_details.country?.code
                            ? getCallingCode(
                                user_details.country.code as CountryCode,
                              )
                            : undefined,
                        },
                        {
                          onSuccess() {
                            setTimer(60);
                            resetForm();
                          },
                        },
                      );
                    }}
                    className={clsx(
                      "cursor-pointer font-medium text-orange-500 hover:text-orange-600",
                      "disabled:cursor-not-allowed disabled:text-orange-300",
                    )}
                  >
                    Resend
                  </button>{" "}
                  {timer > 0 && (
                    <span className="font-medium">
                      in{" "}
                      <span className="text-orange-500">
                        {formatSeconds(timer)} sec
                      </span>
                    </span>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
      {!is_modal && (
        <p className="absolute bottom-6 text-sm lg:hidden">
          Need Help? Call us at{" "}
          <a href="tel:+919415761434" className="font-medium text-orange-500">
            +91 9415761434
          </a>
        </p>
      )}
    </div>
  );
};
export default LoginForm;
