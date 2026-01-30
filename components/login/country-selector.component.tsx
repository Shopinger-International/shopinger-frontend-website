import { useState, Fragment } from "react";

// types
import { IInitialValues } from "@/components/login/login-form.component";

// external component
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

// data
import { countries, Country } from "@/data/countries.data";

// hooks
import { useFormikContext } from "formik";

// helpers
import clsx from "clsx";

const CountrySelector = () => {
  const { values, setFieldValue } = useFormikContext<IInitialValues>();
  const [query, setQuery] = useState("");

  const filteredCountries =
    query === ""
      ? countries
      : countries.filter(
          (country) =>
            country.name.toLowerCase().includes(query.toLowerCase()) ||
            country.calling_code?.includes(query),
        );

  return (
    <Combobox
      value={values["country_code"]}
      onChange={(value) => {
        value && setFieldValue("country_code", value);
      }}
    >
      <div>
        {/* Search Input */}
        <ComboboxInput
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Search country"
          onChange={(e) => setQuery(e.target.value)}
          displayValue={(country: Country) =>
            country ? `${country.name}` : ""
          }
        />

        {/* Options */}
        <ComboboxOptions
          static
          className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white text-sm"
        >
          {filteredCountries.length === 0 ? (
            <div className="px-3 py-2 text-gray-500">No country found</div>
          ) : (
            filteredCountries.map((country) => (
              <ComboboxOption as={Fragment} key={country.code} value={country}>
                {({ selected, focus }) => (
                  <div
                    className={clsx(
                      "flex cursor-pointer items-center gap-2 px-3 py-2",
                      focus && "bg-orange-50 text-orange-600",
                      selected && "bg-orange-500 text-white",
                    )}
                  >
                    <span>{country.flag}</span>
                    <span className="font-medium">{country.name}</span>
                    <span className="ml-auto text-gray-500">
                      {country.calling_code}
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
