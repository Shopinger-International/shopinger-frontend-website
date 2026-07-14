import type { FC } from "react";

// local components
import Badge from "@/components/about-us/badge.component";

const COMPANY_INFORMATION = [
  {
    label: "Brand Name",
    value: "Shopinger",
  },
  {
    label: "Company Name",
    value: "Shopinger International Private Limited",
  },
  {
    label: "Company Registration Date",
    value: "27 March 2025",
  },
  {
    label: "Registered Under",
    value: "Ministry of Corporate Affairs (MCA), Government of India",
  },
  {
    label: "Corporate Identification Number (CIN)",
    value: "U47912UP2025PTC219935",
  },
  {
    label: "GSTIN",
    value: "09ABPCS7248K1CR",
  },
  {
    label: "Registered Office",
    value: (
      <>
        Bharvaliya Bujurg, Near Maurya Complex
        <br />
        Taramandal, Gorakhpur
        <br />
        Uttar Pradesh – 273015, India
      </>
    ),
  },
  {
    label: "Corporate Office",
    value: (
      <>
        Bharvaliya Bujurg, Near Maurya Complex
        <br />
        Taramandal, Gorakhpur
        <br />
        Uttar Pradesh – 273015, India
      </>
    ),
  },
];

const CompanyDetails: FC = () => {
  return (
    <section className="pt-8 sm:pt-16 lg:pt-18">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="mx-auto max-w-3xl space-y-3 text-center lg:space-y-4">
          <Badge title="Company Information" />

          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
            Official Company Details
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-8">
            Shopinger is operated by Shopinger International Private Limited,
            registered under the Ministry of Corporate Affairs (MCA), Government
            of India.
          </p>
        </div>

        {/* Details */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-300 bg-white lg:mt-10">
          <dl className="divide-y divide-gray-200">
            {COMPANY_INFORMATION.map(({ label, value }) => (
              <div
                key={label}
                className="grid gap-3 px-6 py-5 sm:grid-cols-[260px_1fr] sm:gap-8 sm:px-8"
              >
                <dt className="font-semibold text-gray-900">{label}</dt>

                <dd className="leading-7 text-gray-600">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};
export default CompanyDetails;
