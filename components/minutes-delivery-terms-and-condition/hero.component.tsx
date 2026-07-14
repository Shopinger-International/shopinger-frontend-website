// types
import type { FC } from "react";

// icons
import { Clock3, ShieldCheck, MapPinned, FileText } from "lucide-react";

// local components
import Badge from "@/components/about-us/badge.component";

const POLICY_HIGHLIGHTS = [
  {
    icon: Clock3,
    title: "Estimated Delivery",
    description:
      "Minute Delivery is an estimated service, not a guaranteed delivery commitment.",
  },
  {
    icon: MapPinned,
    title: "Serviceable Locations",
    description:
      "Available only in eligible locations with supported warehouses.",
  },
  {
    icon: ShieldCheck,
    title: "Customer Safety",
    description:
      "Safety of customers and delivery partners always comes first.",
  },
  {
    icon: FileText,
    title: "Terms & Conditions",
    description: "Read the complete terms governing Shopinger Minute Delivery.",
  },
];

const Hero: FC = () => {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-300 bg-white sm:rounded-2xl">
      <div className="grid lg:grid-cols-[1.5fr_0.7fr]">
        {/* Left */}
        <div className="p-4 sm:p-8 md:p-10 lg:p-12">
          <Badge title="Minute Delivery Terms" />

          <h1 className="mt-3 text-xl font-bold tracking-tight text-gray-900 sm:mt-4 lg:text-3xl">
            Everything Delivered in Minutes
          </h1>

          <p className="mt-2 text-base font-medium text-orange-500 sm:mt-3">
            Shopinger Minute Delivery – Terms & Conditions
          </p>

          <div className="mt-6 space-y-6">
            <div className="inline-flex rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-600">
              Last Updated: July 2026
            </div>

            <p className="leading-8 text-gray-600">
              <span className="font-semibold text-gray-900">
                "Everything Delivered in Minutes"
              </span>{" "}
              is Shopinger's brand tagline and reflects our commitment to
              providing fast and convenient deliveries.
            </p>

            <p className="leading-8 text-gray-600">
              Minute Delivery is available{" "}
              <span className="font-semibold text-gray-900">
                only for eligible products
              </span>{" "}
              stocked in Shopinger-operated warehouses or fulfillment centers
              and is offered only in selected serviceable locations.
            </p>

            <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 sm:p-6">
              <p className="leading-8 text-gray-600">
                Delivery timelines shown on the Shopinger platform are{" "}
                <span className="font-semibold text-gray-900">estimated</span>{" "}
                and depend on product availability, customer location,
                operational capacity, traffic, weather conditions, and other
                applicable factors.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="border-t border-gray-300 lg:border-t-0 lg:border-l">
          <div className="grid h-full grid-cols-1 gap-px bg-gray-200 sm:grid-cols-2 lg:grid-cols-1">
            {POLICY_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-4 text-center sm:p-6 sm:text-left lg:p-8"
              >
                <Icon
                  className="mx-auto size-8 text-orange-500 sm:mx-0 sm:size-10"
                  strokeWidth={1.8}
                />

                <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;
