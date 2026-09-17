import { Fragment } from "react";
// types
import type { FC } from "react";

// local components
import Highlight from "@/components/home/highlights-bar/highlight.component";

// icons
import { HandCoins, Truck, RotateCcw, Phone, CreditCard } from "lucide-react";

// const
import { FREE_SHIPPING_THRESHOLD } from "@/constants/charges.const";

const highlights_data = [
  {
    icon: HandCoins,
    title: "COD",
    image_path: "./cod.svg",
  },
  {
    icon: Truck,
    title: "Free Delivery",
    image_path: "./free-delivery.svg",
  },
  {
    icon: RotateCcw,
    title: "Easy Return",
    image_path: "./easy-return.svg",
  },
];

const HighlightsBar: FC = () => {
  return (
    <div className="mx-auto flex w-full min-w-0 items-center justify-center overflow-hidden px-4">
      {highlights_data.map((data, index) => (
        <Fragment key={`highlight-${index}`}>
          {index > 0 && (
            <div className="mx-2 h-6 w-px shrink-0 bg-gray-300 sm:mx-4" />
          )}

          <Highlight {...data} />
        </Fragment>
      ))}
    </div>
  );
};

export default HighlightsBar;
