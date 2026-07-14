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
        <div className="mt-6 grid gap-5 sm:mt-8 md:grid-cols-2 lg:mt-10">
          <a
            href={`tel:${process.env.NEXT_PUBLIC_ADMIN_PHONE}`}
            className="rounded-lg border border-gray-300 bg-white p-3 hover:border-orange-300 sm:rounded-xl sm:p-6"
          >
            <p className="text-sm text-gray-600">Phone</p>

            <p className="mt-1 text-base font-semibold text-gray-900 sm:mt-2 sm:text-xl">
              {process.env.NEXT_PUBLIC_ADMIN_PHONE}
            </p>
          </a>

          <a
            href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
            className="rounded-lg border border-gray-300 bg-white p-3 hover:border-orange-300 sm:rounded-xl sm:p-6"
          >
            <p className="text-sm text-gray-600">Email</p>

            <p className="mt-1 text-base font-semibold text-gray-900 sm:mt-2 sm:text-xl">
              {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            </p>
          </a>
        </div>
      </div>
    </section>
  );
};
export default GetInTouch;
