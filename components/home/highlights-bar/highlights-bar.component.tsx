import { Fragment } from "react";
// types
import type { FC } from "react";

// local components
import Highlight from "@/components/home/highlights-bar/highlight.component";

// icons
import { HandCoins, Truck, RotateCcw, BadgeCheck, Phone } from "lucide-react";

const highlights_data = [
  {
    icon: HandCoins,
    title: "COD Available",
    para: "Pay when you receive",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    para: "Above ₹199",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    para: "7 days*",
  },
  {
    icon: BadgeCheck,
    title: "100% Original Products",
    para: "Quality you can trust",
  },
  {
    icon: Phone,
    title: "Call to Order",
    para: `${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
  },
];

const HighlightsBar: FC = () => {
  return (
    <div className="mx-auto hidden w-fit items-center gap-4 rounded-xl px-4 py-0 lg:flex">
      {highlights_data.map((data, index) => (
        <Fragment key={`highlight-${index}`}>
          {index > 0 && <div className="mx-4 h-6 w-0.5 bg-gray-300" />}
          <Highlight {...data} />
        </Fragment>
      ))}
    </div>
  );
};
export default HighlightsBar;
