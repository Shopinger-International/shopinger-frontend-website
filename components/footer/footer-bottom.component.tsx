import Image from "next/image";
// types
import type { FC } from "react";

export const payment_methods = [
  "google-pay",
  "paypal",
  "visa",
  "rupay",
  "cash-on-delivery",
  "emi-options",
];
const FooterBottom: FC = () => {
  return (
    <div className="w-full bg-orange-500 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-4 px-4 py-3 lg:justify-between">
        {/* Left section */}
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-medium">
            ©2025–2026 Shopinger. All Rights Reserved.
          </span>
        </div>

        {/* Right section */}
        <div className="hidden flex-wrap items-center gap-3 lg:flex">
          {payment_methods.map((icon) => (
            <Image
              key={icon}
              src={`/footer/payment-method/${icon}.png`}
              alt={icon}
              width={40}
              height={24}
              className="h-6 w-auto rounded bg-white p-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
