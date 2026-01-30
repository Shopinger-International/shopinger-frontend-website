// src/data/countries.ts
import rawCountries from "world-countries";

export type Country = {
  code: string;
  name: string;
  flag: string;
  calling_code: string | null;
};

export const countries: Country[] = rawCountries
  .filter((c) => c.independent)
  .map((c) => {
    const calling_code =
      c.idd?.root && c.idd?.suffixes?.length
        ? `${c.idd.root}${c.idd.suffixes[0]}`
        : null;

    return {
      code: c.cca2,
      name: c.name.common,
      flag: c.flag,
      calling_code,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
