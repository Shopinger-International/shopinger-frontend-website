// types
import type { FC } from "react";

// local components
import Badge from "@/components/about-us/badge.component";

const GetInTouch: FC = () => {
  return (
    <section className="pt-8 sm:pt-16 lg:pt-18">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="space-y-3 text-center lg:space-y-4">
          <Badge title="Get in Touch" />
          <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
            Have a question or need assistance?
          </h2>

          <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-8">
            Our support team is here to help. Whether you have questions about
            orders, deliveries, payments, seller services, or any other inquiry,
            we'll be happy to assist you.
          </p>
        </div>

        {/* Contact */}
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:mt-10">
          <a
            href={`tel:${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
            className="rounded-xl border border-gray-300 bg-white p-4 hover:border-orange-300 sm:p-6"
          >
            <p className="text-sm text-gray-600">Phone</p>

            <p className="mt-2 text-lg font-semibold text-gray-900 sm:text-xl">
              {process.env.NEXT_PUBLIC_ADMIN_PHONE}
            </p>
          </a>

          <a
            href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
            className="rounded-xl border border-gray-300 bg-white p-4 hover:border-orange-300 sm:p-6"
          >
            <p className="text-sm text-gray-600">Email</p>

            <p className="mt-2 text-lg font-semibold text-gray-900 sm:text-xl">
              {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            </p>
          </a>
        </div>

        {/* Trademark */}
        <div className="mt-8 border-t border-gray-300 pt-6 sm:mt-10 sm:pt-8">
          <h3 className="text-lg font-semibold text-gray-900">
            Trademark Information
          </h3>

          <p className="mt-2 leading-8 text-gray-600 sm:mt-4">
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
export default GetInTouch;
