import rawCountries from "world-countries";

export type ICountry = {
  code: string;
  name: string;
  flag: string;
  phone_code: string;
};
export const countries = rawCountries
  .filter((c) => c.independent)
  .map((c) => ({
    code: c.cca2,
    name: c.name.common,
    flag: `https://flagcdn.com/w40/${c.cca2.toLowerCase()}.png`,
    phone_code: c.idd?.root
      ? `${c.idd.root.replace("+", "")}${c.idd.suffixes?.[0] ?? ""}`
      : "",
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
