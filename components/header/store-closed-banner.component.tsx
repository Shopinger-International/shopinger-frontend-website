import type { FC } from "react";
import { cn } from "@/lib/utils";

const StoreAwningIcon: FC<{ className?: string }> = ({
  className = "size-11 text-[#F05A28]",
}) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Scalloped Awning Top */}
    <path
      d="M7 17V11C7 9.89543 7.89543 9 9 9H39C40.1046 9 41 9.89543 41 11V17"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 17C7 19.2091 8.79086 21 11 21C13.2091 21 15 19.2091 15 17C15 19.2091 16.7909 21 19 21C21.2091 21 23 19.2091 23 17C23 19.2091 24.7909 21 27 21C29.2091 21 31 19.2091 31 17C31 19.2091 32.7909 21 35 21C37.2091 21 39 19.2091 39 17C39 19.2091 40.7909 21 41 21"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Store Walls & Base */}
    <path
      d="M9.5 21V39C9.5 40.1046 10.3954 41 11.5 41H36.5C37.6046 41 38.5 40.1046 38.5 39V21"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arch Doorway */}
    <path
      d="M19.5 41V30C19.5 27.5147 21.5147 25.5 24 25.5C26.4853 25.5 28.5 27.5147 28.5 30V41"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SunriseIcon: FC<{ className?: string }> = ({
  className = "size-9 text-[#F05A28]",
}) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Sun Semi-circle */}
    <path
      d="M10 24C10 19.5817 13.5817 16 18 16C22.4183 16 26 19.5817 26 24"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Horizon Curve */}
    <path
      d="M4 27.5C12 25 24 25 32 27.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    {/* Sun Rays */}
    <path
      d="M18 8V11.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M10.5 11.5L13 14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M25.5 11.5L23 14"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M5 19H8.5"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M27.5 19H31"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

type IStoreClosedBannerProps = {
  title?: string;
  open_time?: string;
  message?: string;
  className?: string;
};

const StoreClosedBanner: FC<IStoreClosedBannerProps> = ({
  title = "We’re closed right now",
  open_time = "7:00 AM",
  message = "Order now. Deliveries resume at 7:00 AM.",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between rounded-xl sm:rounded-2xl border border-[#FEEAD9] bg-[#FFF6EE] p-3 sm:px-5 sm:py-3.5 shadow-xs",
        className,
      )}
    >
      {/* LEFT: Store Awning Icon + Title & Description */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <StoreAwningIcon className="size-10 sm:size-12 shrink-0 text-[#F05A28]" />

        <div className="flex flex-col min-w-0">
          <h3 className="text-base sm:text-lg font-bold leading-tight text-[#0D1829] truncate">
            {title}
          </h3>

          {/* Mobile view: "Opens at 7:00 AM" under title */}
          <p className="text-sm font-bold leading-snug text-[#E03628] sm:hidden">
            Opens at {open_time}
          </p>

          <p className="text-xs sm:text-sm font-medium leading-tight text-[#717D8A] truncate mt-0.5 sm:mt-0">
            {message}
          </p>
        </div>
      </div>

      {/* RIGHT: Desktop view "Opens at 7:00 AM" + Sunrise Icon */}
      <div className="flex items-center gap-3 ml-2 shrink-0">
        <p className="hidden text-base sm:text-lg text-[#E03628] sm:block">
          Opens at {open_time}
        </p>
        <SunriseIcon className="size-9 sm:size-10 text-[#F05A28]" />
      </div>
    </div>
  );
};

export default StoreClosedBanner;
