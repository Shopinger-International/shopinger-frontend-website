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
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-300 bg-white sm:mt-8 sm:rounded-2xl lg:mt-10">
          <dl className="divide-y divide-gray-200">
            {COMPANY_INFORMATION.map(({ label, value }) => (
              <div
                key={label}
                className="grid gap-2 px-4 py-3 sm:grid-cols-[260px_1fr] sm:gap-8 sm:px-8 sm:py-5"
              >
                <dt className="font-semibold text-gray-900">{label}</dt>

                <dd className="leading-7 text-gray-600">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Trademark */}
        <div className="mt-6 border-t border-gray-300 pt-4 sm:mt-10 sm:pt-8">
          <h3 className="text-lg font-semibold text-gray-900">
            Trademark Information
          </h3>

          <p className="mt-2 leading-7 text-gray-600 sm:mt-4 sm:leading-8">
            The <strong>SHOPINGER</strong> word mark and the
            <strong> Shopinger logo</strong> are registered trademarks of
            <strong> Shopinger International Private Limited</strong> and are
            protected under the Trade Marks Act, 1999. Unauthorized use,
            reproduction, imitation, or distribution of the Shopinger name,
            logo, or other brand assets is prohibited without prior written
            permission.
          </p>
        </div>
      </div>
    </section>
  );
};
export default CompanyDetails;
