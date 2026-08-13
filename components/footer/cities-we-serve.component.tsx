import type { FC } from "react";
import { MapPin } from "lucide-react";

// icons
import { GiIndiaGate } from "react-icons/gi";
import { MdTempleHindu } from "react-icons/md";

const cities = [
  {
    name: "New Delhi, Delhi",
    icon: GiIndiaGate,
  },
  {
    name: "Gorakhpur, Uttar Pradesh",
    icon: MdTempleHindu,
  },
];

const CitiesWeServe: FC = () => {
  return (
    <section className="max-w-8xl mx-auto space-y-2.5 px-4 pb-8 sm:space-y-3 lg:px-12">
      {/* Heading */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex-1 translate-y-4 border-b border-dashed" />

        <div className="flex shrink-0 flex-col items-center space-y-1 sm:space-y-2 ">
          <MapPin
            className="size-6 text-orange-500 sm:size-7"
            strokeWidth={1.5}
          />

          <h2 className="text-sm font-semibold">
            Cities We <span className="text-orange-500">Serve</span>
          </h2>
        </div>

        <div className="flex-1 translate-y-4 border-b border-dashed" />
      </div>

      {/* Cities */}
      <div className="flex items-center justify-center gap-2 whitespace-nowrap sm:gap-5">
        {cities.map(({ name, icon: Icon }, index) => (
          <div key={name} className="flex items-center gap-2 sm:gap-5">
            <div className="flex items-center gap-1.5 sm:gap-3">
              <Icon className="size-5 shrink-0 text-orange-500 sm:size-6" />

              <span className="text-xs font-medium text-white/80 sm:text-sm">
                {name}
              </span>
            </div>

            {index < cities.length - 1 && (
              <span className="text-white/80">|</span>
            )}
          </div>
        ))}
      </div>
      {/* Description */}
      <p className="text-center text-xs leading-6 sm:text-sm text-white/80 font-medium">
        Shopinger is currently available in selected PIN codes <br />
        110008, 273411
      </p>
    </section>
  );
};

export default CitiesWeServe;
