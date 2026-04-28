import Image from "next/image";
import { useState, Fragment } from "react";

// types
import type { FC } from "react";
import type { IInitialValues } from "@/components/login/login-form.component";
import type { CountryCode } from "libphonenumber-js";

// external component
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

// data
import { countries } from "@/data/countries.data";

// hooks
import { useFormikContext } from "formik";

// helpers
import clsx from "clsx";
import { getCallingCode } from "@/helpers/common.helper";

const CountrySelector: FC<{
  handleChange: () => void;
}> = ({ handleChange }) => {
  const { values, setFieldValue } = useFormikContext<IInitialValues>();
  const [query, setQuery] = useState("");

  const filtered_countries =
    query === ""
      ? countries
      : countries.filter(
          (country) =>
            country.name.toLowerCase().includes(query.toLowerCase()) ||
            country.code?.includes(query),
        );

  return (
    <Combobox
      value={values.country}
      onChange={(value) => {
        value && setFieldValue("country", value);
        handleChange();
      }}
    >
      <div>
        {/* Search Input */}
        <ComboboxInput
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Search country"
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(country) => {
            console.log("value of country", country);
            return "";
          }}
        />

        {/* Options */}
        <ComboboxOptions
          static
          className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white text-sm"
        >
          {filtered_countries.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">No country found</div>
          ) : (
            filtered_countries.map((country) => (
              <ComboboxOption as={Fragment} key={country.code} value={country}>
                {({ selected, focus }) => (
                  <div
                    className={clsx(
                      "flex cursor-pointer items-center gap-2 px-3 py-2",
                      focus && "bg-orange-50 text-orange-600",
                      selected && "bg-orange-500 text-white",
                    )}
                  >
                    <Image src={country.flag} width={8} height={8} alt="flag" className="size-3 object-cover" />
                    <span className="font-medium">{country.name}</span>
                    <span className="ml-auto text-gray-500">
                      {getCallingCode(country.code as CountryCode)}
                    </span>
                  </div>
                )}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
};

export default CountrySelector;
