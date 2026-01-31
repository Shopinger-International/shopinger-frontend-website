// src/data/countries.ts
import rawCountries from "world-countries";

export type Country = {
  code: string;
  name: string;
  flag: string;
};
export const countries = rawCountries
  .filter((c) => c.independent)
  .map((c) => ({
    code: c.cca2,
    name: c.name.common,
    flag: c.flag,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
