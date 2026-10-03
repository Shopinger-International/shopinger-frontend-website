import Image from "next/image";
// types
import type { FC } from "react";

export const payment_methods = [
  "google-pay",
  "visa",
  "rupay",
  "cash-on-delivery",
  "emi-options",
];
const FooterBottom: FC = () => {
  return (
    <div className="w-full bg-background border-t border-orange-200/80 text-background-foreground">
      <div className="mx-auto flex max-w-8xl flex-wrap items-center justify-center gap-4 px-4 lg:px-12 py-3.5 lg:justify-between">
        {/* Left section */}
        <div className="flex flex-wrap items-center gap-6">
          <span className="font-medium text-xs sm:text-sm text-background-foreground">
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
              className="h-6 w-auto rounded bg-white p-1 border border-gray-200 shadow-2xs"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;
