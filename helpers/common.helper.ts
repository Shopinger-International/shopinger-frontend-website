// types
import type { ZodType } from "zod";
import type { CountryCode } from "libphonenumber-js";

// helpers/phone.helper.ts
import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";

// Convert smart quotes → normal apostrophe before comparison:
const normalizeText = (str: string) =>
  str.toLowerCase().replace(/[’‘]/g, "'").trim();

function toFormikValidate<T>(schema: ZodType<T, any, any>) {
  return (values: unknown) => {
    const result = schema.safeParse(values);
    if (result.success) return {};

    const errors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const path = issue.path.join(".");
      if (path) errors[path] = issue.message;
    }

    return errors;
  };
}
const capitalizeValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const capitalizeFirstLetter = (value: string) =>
  value.trim().charAt(0).toUpperCase() + value.trim().slice(1).toLowerCase();

const startsWithNumber = (str: string) => /^[0-9]/.test(str);

const getCallingCode = (iso2: CountryCode) => {
  try {
    return `+${getCountryCallingCode(iso2)}`;
  } catch {
    return "";
  }
};

const formatSeconds = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export {
  normalizeText,
  toFormikValidate,
  capitalizeValue,
  capitalizeFirstLetter,
  startsWithNumber,
  getCallingCode,
  formatSeconds,
};
