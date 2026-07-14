// types
import type { FC } from "react";

// icons
import { ShieldCheck, FileText, Scale, CircleCheck } from "lucide-react";

// components
import Badge from "@/components/about-us/badge.component";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "Your Responsibilities",
    description:
      "Understand your rights, responsibilities, and acceptable use of the Shopinger platform.",
  },
  {
    icon: FileText,
    title: "Platform Policies",
    description:
      "Read together with our Privacy Policy, Shipping Policy, and other applicable policies.",
  },
  {
    icon: Scale,
    title: "Legal Compliance",
    description:
      "Governed by the applicable laws of India and relevant regulations.",
  },
  {
    icon: CircleCheck,
    title: "Acceptance",
    description:
      "Using Shopinger signifies your acceptance of these Terms & Conditions.",
  },
];

const Hero: FC = () => {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-300 bg-white sm:rounded-2xl">
      <div className="grid lg:grid-cols-[1.5fr_0.7fr]">
        {/* Left */}
        <div className="p-4 sm:p-8 md:p-10 lg:p-12">
          <Badge title="Terms & Conditions" />

          <h1 className="mt-3 text-xl font-bold tracking-tight text-gray-900 lg:text-3xl">
            Shopinger Terms & Conditions
          </h1>

          <p className="mt-2 text-sm text-gray-500">Last Updated: July 2026</p>

          <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-6 lg:mt-8">
            <p className="text-gray-600">
              Welcome to{" "}
              <span className="font-semibold text-gray-900">
                Shopinger International Private Limited
              </span>
              . These Terms & Conditions govern your access to and use of the
              Shopinger website, mobile applications, Seller Platform, Delivery
              Partner Platform, and all related services.
            </p>

            <p className="text-gray-600">
              By accessing or using the Platform, you acknowledge that you have
              read, understood, and agree to be bound by these Terms &
              Conditions together with our Privacy Policy, Shipping Policy,
              Cancellation & Refund Policy, and other applicable policies.
            </p>

            <div className="rounded-xl border border-gray-300 bg-gray-50 p-4 sm:p-6">
              <p className="leading-7 text-gray-600">
                These Terms explain your rights and responsibilities, account
                usage, orders, payments, marketplace services, intellectual
                property, liability, dispute resolution, and other important
                legal information governing your relationship with Shopinger.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="border-t border-gray-300 lg:border-t-0 lg:border-l">
          <div className="grid h-full grid-cols-1 gap-px bg-gray-200 sm:grid-cols-2 lg:grid-cols-1">
            {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white p-4 text-center sm:p-6 sm:text-left lg:p-8"
              >
                <Icon
                  className="mx-auto size-8 text-orange-500 sm:mx-0 sm:size-10"
                  strokeWidth={1.8}
                />

                <h3 className="mt-2 font-semibold text-gray-900 sm:mt-3">
                  {title}
                </h3>

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
