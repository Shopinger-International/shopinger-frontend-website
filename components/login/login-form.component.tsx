import Link from "next/link";
import Image from "next/image";
// types
import type { FC } from "react";
import type { FieldProps } from "formik";
import type { Country } from "@/data/countries.data";

// external components
import { Formik, Form, Field } from "formik";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

// local components
import CountrySelector from "@/components/login/country-selector.component";

// helpers
import { z } from "zod";
import { toFormikValidate } from "@/helpers/common.helper";

// data
import { countries } from "@/data/countries.data";

export type IInitialValues = {
  contact: string;
  country_code: Country | undefined;
};

const initial_values = {
  contact: "",
  country_code: countries.find(({ name }) => name == "India"),
};
const login_validation_schema = z.object({
  contact: z.string().refine(
    (val) => {
      const isPhone = /^\d{10}$/.test(val);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      return isPhone || isEmail;
    },
    {
      message: "Enter a valid 10-digit phone number or email",
    },
  ),
});

const LoginForm: FC = () => {
  return (
    <div className="relative flex min-h-155 min-w-108 flex-col items-center space-y-4 bg-white px-6 lg:px-12">
      <div className="relative mt-30 flex size-20 shrink-0 items-center justify-center">
        <Image
          src="/dark-mobile-logo.jpg"
          alt="Shopinger – Online Shopping Platform"
          fill
          priority
          className="object-contain"
        />
      </div>
      {/* Heading */}
      <h2 className="text-2xl font-bold text-orange-500">Login or Sign Up</h2>

      <Formik<IInitialValues>
        initialValues={initial_values}
        validate={toFormikValidate(login_validation_schema)}
        onSubmit={(values) => {
          console.log("values on submit", values);
        }}
      >
        {({ values, errors, handleSubmit }) => (
          <Form onSubmit={handleSubmit} className="w-full space-y-3">
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
                    <Popover className="relative">
                      <PopoverButton className="flex items-center gap-1 rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-orange-400 focus:outline-none">
                        {values.country_code?.calling_code}
                        <svg
                          className="h-4 w-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </PopoverButton>

                      <PopoverPanel className="absolute z-20 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                        <div className="max-h-64 overflow-y-auto p-2">
                          <CountrySelector />
                        </div>
                      </PopoverPanel>
                    </Popover>
                    <input
                      id="contact"
                      type="text"
                      placeholder="Mobile number or email"
                      className="w-full rounded-r-md border border-gray-300 px-3 py-2 hover:outline-orange-500"
                      {...field}
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
              className="w-full cursor-pointer rounded-md border border-gray-300 bg-orange-500 py-2 font-bold text-white hover:bg-orange-600"
              type="submit"
            >
              Get OTP
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};
export default LoginForm;
