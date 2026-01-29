import Link from "next/link";
// types
import type { FC } from "react";

const BestDealsCard: FC = () => {
  return (
    <div className="w-60 shrink-0 space-y-2 md:w-72">
      <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow hover:shadow-xl">
        <div className="flex aspect-square items-center justify-center bg-orange-50 p-4 md:p-6">
          <img
            src="https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=500&fit=crop&q=80"
            alt="Yellow floral dress"
            className="h-full w-full rounded-lg object-cover"
          />
        </div>
      </div>
      <p className="font-medium">Up to 65% off | Fashion essentials</p>
    </div>
  );
};
export default BestDealsCard;
