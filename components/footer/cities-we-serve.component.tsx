import type { FC } from "react";
import { MapPin } from "lucide-react";

// icons
import { GiIndiaGate } from "react-icons/gi";
import { MdTempleHindu } from "react-icons/md";

const cities = [
  {
    name: "New Delhi, Delhi - 110008",
    icon: GiIndiaGate,
  },
  {
    name: "Gorakhpur, Uttar Pradesh - 273411",
    icon: MdTempleHindu,
  },
];
const cityAreas = [
  [
    { name: "Baljeet Nagar", city: "Delhi" },
    { name: "Ranjeet Nagar", city: "Delhi" },
    { name: "West Patel Nagar", city: "Delhi" },
    { name: "East Patel Nagar", city: "Delhi" },
    { name: "South Patel Nagar", city: "Delhi" },
    { name: "Nehru Nagar", city: "Delhi" },
    { name: "Prem Nagar", city: "Delhi" },
    { name: "Shadipur", city: "Delhi" },
    { name: "Shadi Khampur", city: "Delhi" },
    { name: "Baba Farid Puri", city: "Delhi" },
    { name: "DMS Colony", city: "Delhi" },
    { name: "DTC Colony, Shadipur", city: "Delhi" },
    { name: "New Ranjeet Nagar", city: "Delhi" },
    { name: "Old Ranjeet Nagar", city: "Delhi" },
    { name: "Guru Nanak Nagar", city: "Delhi" },
    { name: "Punjabi Basti", city: "Delhi" },
    { name: "Railway Colony", city: "Delhi" },
    { name: "Munshi Ram Bagh", city: "Delhi" },
  ],
  [
    { name: "Akusi", city: "Gorakhpur" },
    { name: "Basoodeeha", city: "Gorakhpur" },
    { name: "Baspurwa", city: "Gorakhpur" },
    { name: "Bela Ah.", city: "Gorakhpur" },
    { name: "Belavir Bhan", city: "Gorakhpur" },
    { name: "Belkur", city: "Gorakhpur" },
    { name: "Demusa", city: "Gorakhpur" },
    { name: "Deokali Buzurg", city: "Gorakhpur" },
    { name: "Dharsi", city: "Gorakhpur" },
    { name: "Doodapar", city: "Gorakhpur" },
    { name: "Gangachak", city: "Gorakhpur" },
    { name: "Ghorsaon", city: "Gorakhpur" },
    { name: "Harha Bhar", city: "Gorakhpur" },
    { name: "Harigana", city: "Gorakhpur" },
    { name: "Imilihwa", city: "Gorakhpur" },
    { name: "Jagdeeshpur", city: "Gorakhpur" },
    { name: "Jameenlauharpur", city: "Gorakhpur" },
    { name: "Jeevkar", city: "Gorakhpur" },
    { name: "Kaidaha Buzurg", city: "Gorakhpur" },
    { name: "Kaidaha Khurd", city: "Gorakhpur" },
    { name: "Kaithwalia", city: "Gorakhpur" },
    { name: "Kalechak", city: "Gorakhpur" },
    { name: "Karwal Urf Manjhgawa", city: "Gorakhpur" },
    { name: "Khajuri", city: "Gorakhpur" },
    { name: "Kopwa", city: "Gorakhpur" },
    { name: "Kotha Ah.", city: "Gorakhpur" },
    { name: "Kotha Mu.", city: "Gorakhpur" },
    { name: "Lagunahi", city: "Gorakhpur" },
    { name: "Lahdari Khurd", city: "Gorakhpur" },
    { name: "Lahidari", city: "Gorakhpur" },
    { name: "Lahidari Buzurg", city: "Gorakhpur" },
    { name: "Lakhnaura", city: "Gorakhpur" },
    { name: "Majhgnawa", city: "Gorakhpur" },
    { name: "Manjharia", city: "Gorakhpur" },
    { name: "Manokishunpur", city: "Gorakhpur" },
    { name: "Masan Pakar", city: "Gorakhpur" },
    { name: "Mitanpur Buz", city: "Gorakhpur" },
    { name: "Mitanpur Khurd", city: "Gorakhpur" },
    { name: "Nagwa", city: "Gorakhpur" },
    { name: "Nagawa", city: "Gorakhpur" },
    { name: "Narrey Buzurg", city: "Gorakhpur" },
    { name: "Narrey Khurd", city: "Gorakhpur" },
  ],
];

const CitiesWeServe: FC = () => {
  return (
    <section className="max-w-8xl mx-auto space-y-2.5 px-4 pb-8 sm:space-y-3 lg:px-12">
      {/* Heading */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="flex-1 translate-y-4 border-b border-dashed border-orange-200" />

        <div className="flex shrink-0 flex-col items-center space-y-1 sm:space-y-2">
          <MapPin className="text-brand size-6 sm:size-7" strokeWidth={1.5} />

          <h2 className="text-background-foreground text-sm font-semibold">
            Cities We <span className="text-brand">Serve</span>
          </h2>
        </div>

        <div className="flex-1 translate-y-4 border-b border-dashed border-orange-200" />
      </div>
      <p className="text-background-foreground/80 text-center text-xs leading-6 font-medium sm:text-sm">
        Shopinger is currently available in
      </p>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
        {cities.map(({ name }, index) => (
          <div key={name} className="space-y-2">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              {/* <Icon className="text-brand size-5 shrink-0" aria-hidden="true" /> */}
              <h3 className="text-background-foreground text-center text-xs font-semibold sm:text-left sm:text-sm">
                {name}
              </h3>
            </div>
            <p className="text-background-foreground/75 text-center text-xs leading-6 sm:text-left sm:text-sm">
              {cityAreas[index].map(({ name: area }) => area).join(", ")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CitiesWeServe;
