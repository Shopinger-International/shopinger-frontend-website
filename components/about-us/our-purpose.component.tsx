// types
import type { FC } from "react";

// icons
import { Target, Eye } from "lucide-react";

// local components
import Badge from "@/components/about-us/badge.component";

const MISSION_VISION = [
  {
    title: "Our Mission",
    subtitle: "Our Purpose",
    description:
      "To simplify everyday shopping by providing fast, reliable, and affordable access to products through technology, innovation, efficient logistics, and exceptional customer service.",
    icon: Target,
  },
  {
    title: "Our Vision",
    subtitle: "Looking Ahead",
    description:
      "To become India's most trusted commerce platform by delivering convenience, value, and reliable shopping experiences to customers across the country.",
    icon: Eye,
  },
];

const OurPurpose: FC = () => {
  return (
    <section className="space-y-8 pt-8 sm:space-y-10 sm:pt-16 lg:space-y-12 lg:pt-18">
      <div className="mx-auto max-w-3xl space-y-3 text-center lg:space-y-4">
        <Badge title="Our Purpose" />
        <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl lg:text-3xl">
          Driven by Our Mission & Vision
        </h2>

        <p className="mx-auto max-w-2xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-8">
          Everything we build at Shopinger is guided by a commitment to
          convenience, innovation, reliability, and creating better shopping
          experiences for every customer.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {MISSION_VISION.map(({ title, subtitle, description, icon: Icon }) => (
          <article
            key={title}
            className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white p-5 sm:p-6 lg:p-8"
          >
            {/* Decorative Glow */}
            <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-orange-100 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-70" />

            <div className="relative z-10 flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 transition-all duration-300 group-hover:border-orange-500 group-hover:bg-orange-500 sm:size-14 sm:rounded-xl">
                  <Icon
                    className="size-6 text-orange-500 transition-colors duration-300 group-hover:text-white sm:size-7"
                    strokeWidth={2}
                  />
                </div>

                <div>
                  <p className="text-[11px] font-semibold tracking-wider text-orange-500 uppercase sm:text-xs">
                    {subtitle}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl lg:text-2xl">
                    {title}
                  </h3>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-linear-to-r from-orange-300 via-orange-100 to-transparent sm:my-6" />

              {/* Description */}
              <p className="flex-1 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                {description}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
export default OurPurpose;
