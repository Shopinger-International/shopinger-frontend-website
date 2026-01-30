// types
import type { ZodType } from "zod";

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

export { normalizeText, toFormikValidate, capitalizeValue };
