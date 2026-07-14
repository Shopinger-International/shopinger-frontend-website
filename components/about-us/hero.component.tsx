// types
import type { FC } from "react";

// icons
import { Package, Truck, Grid2x2, HeartHandshake } from "lucide-react";

// local components
import Badge from "@/components/about-us/badge.component";

const HIGHLIGHTS = [
  {
    icon: Package,
    value: "30K+",
    title: "Products",
    description: "Across multiple categories.",
    highlight: true,
  },
  {
    icon: Truck,
    title: "Minute Delivery",
    description: "Available in serviceable locations.",
  },
  {
    icon: Grid2x2,
    title: "Multiple Categories",
    description: "Everything you need in one place.",
  },
  {
    icon: HeartHandshake,
    title: "Customer First",
    description: "Built around convenience and reliability.",
  },
];

const Hero: FC = () => {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-300 bg-white sm:rounded-2xl">
      <div className="grid lg:grid-cols-[1.5fr_0.7fr]">
        {/* Left */}
        <div className="p-4 sm:p-8 md:p-10 lg:p-12">
          <Badge title="About Shopinger" />
          <h1 className="mt-3 text-xl font-bold tracking-tight text-gray-900 sm:mt-4 lg:text-3xl">
            Everything Delivered in Minutes
          </h1>

          <div className="mt-3 space-y-4 sm:mt-4 sm:space-y-6 lg:mt-6 lg:space-y-8">
            <p className="text-gray-600">
              Shopinger is an Indian quick commerce platform committed to making
              everyday shopping faster, simpler, and more convenient.
            </p>

            <p className="text-gray-600">
              With{" "}
              <span className="font-semibold text-gray-900">
                30,000+ products across multiple categories
              </span>
              , Shopinger delivers a seamless shopping experience powered by
              advanced technology, strategically located warehouses, and an
              efficient delivery network.
            </p>

            <p className="text-gray-600">
              Selected products stocked at Shopinger warehouses are eligible for
              minute delivery in serviceable locations, enabling customers to
              receive everyday essentials quickly and conveniently.
            </p>

            <div className="rounded-xl border border-gray-300 bg-gray-50 p-3 sm:p-4 lg:p-6">
              <p className="leading-8 text-gray-600">
                Built with a customer-first approach, Shopinger focuses on{" "}
                <span className="font-semibold text-gray-900">
                  speed, convenience, affordability, and reliability
                </span>
                . Whether it's a planned purchase or an urgent requirement,
                Shopinger is committed to delivering a smooth, secure, and
                dependable shopping experience from order placement to doorstep
                delivery.
              </p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="border-t border-gray-300 lg:border-t-0 lg:border-l">
          <div className="grid h-full grid-cols-1 gap-px bg-gray-200 sm:grid-cols-2 lg:grid-cols-1">
            {HIGHLIGHTS.map(
              ({ icon: Icon, value, title, description, highlight }) => (
                <div key={title} className="bg-white p-4 sm:p-6 lg:p-8">
                  {value ? (
                    <p
                      className={`text-2xl font-bold sm:text-3xl lg:text-4xl ${
                        highlight ? "text-orange-500" : "text-gray-900"
                      }`}
                    >
                      {value}
                    </p>
                  ) : (
                    <Icon
                      className="size-8 text-orange-500 sm:size-10"
                      strokeWidth={1.8}
                    />
                  )}

                  <h3 className="mt-2 font-semibold text-gray-900 sm:mt-3">
                    {title}
                  </h3>

                  <p className="text-sm leading-6 text-gray-600 sm:mt-1">
                    {description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
