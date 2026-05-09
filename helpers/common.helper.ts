// types
import type { ZodType } from "zod";
import type { CountryCode } from "libphonenumber-js";

// countries
import { countries } from "@/data/countries.data";

// helpers/phone.helper.ts
import { getCountryCallingCode } from "libphonenumber-js";

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
const formatDate = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
const timeAgo = (dateString: string) => {
  const now = new Date();
  const created = new Date(dateString);

  const seconds = Math.floor((now.getTime() - created.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

const debouncePromise = <T>(
  fn: (...args: any[]) => Promise<T>,
  delay: number,
) => {
  let timer: NodeJS.Timeout;

  return (...args: any[]): Promise<T> =>
    new Promise((resolve) => {
      clearTimeout(timer);

      timer = setTimeout(async () => {
        resolve(await fn(...args));
      }, delay);
    });
};

export {
  normalizeText,
  toFormikValidate,
  capitalizeValue,
  capitalizeFirstLetter,
  startsWithNumber,
  getCallingCode,
  formatSeconds,
  formatDate,
  timeAgo,
  debouncePromise,
};
