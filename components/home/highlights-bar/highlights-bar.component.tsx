import { Fragment } from "react";
// types
import type { FC } from "react";

// local components
import Highlight from "@/components/home/highlights-bar/highlight.component";

// icons
import { HandCoins, Truck, RotateCcw, Phone, CreditCard } from "lucide-react";

const highlights_data = [
  {
    icon: CreditCard,
    title: "Easy EMI",
    para: "At your doorstep",
  },
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
    title: "Easy Return & Refund",
    para: "3 to 5 days*",
  },
  {
    icon: Phone,
    title: "Call to Order",
    para: `${process.env.NEXT_PUBLIC_ADMIN_PHONE}`,
  },
];

const HighlightsBar: FC = () => {
  return (
    <div className="no-scrollbar mx-auto flex items-center gap-0 overflow-x-auto rounded-xl px-4 py-0 sm:gap-4 lg:w-fit">
      {highlights_data.map((data, index) => (
        <Fragment key={`highlight-${index}`}>
          {index > 0 && <div className="mx-4 h-6 w-0.5 shrink-0 bg-gray-300" />}
          <Highlight {...data} />
        </Fragment>
      ))}
    </div>
  );
};
export default HighlightsBar;
