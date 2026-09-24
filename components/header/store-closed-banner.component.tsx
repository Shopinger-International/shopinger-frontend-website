import type { FC } from "react";
import { cn } from "@/lib/utils";

const MoonIcon: FC<{ className?: string }> = ({
  className = "size-10 text-[#F05A28]",
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke="currentColor"
      strokeWidth="2.2"
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
        "flex w-full items-center justify-between rounded-lg sm:rounded-xl border border-[#FEEAD9] bg-[#FFF6EE] lg:bg-white px-3 py-1.5 sm:px-4 sm:py-1.5 shadow-2xs",
        className,
      )}
    >
      {/* LEFT: Moon Icon + Title & Description */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <MoonIcon className="size-6 sm:size-7 shrink-0 text-[#F05A28]" />

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <h3 className="text-xs sm:text-sm font-bold leading-none text-[#0D1829] truncate">
              {title}
            </h3>

            {/* Mobile view: "Opens at 7:00 AM" inline or under */}
            <span className="text-xs font-bold leading-none text-[#E03628] sm:hidden">
              · Opens at {open_time}
            </span>
          </div>

          <p className="text-[11px] sm:text-xs font-medium leading-none text-[#717D8A] truncate mt-1 sm:mt-0.5">
            {message}
          </p>
        </div>
      </div>

      {/* RIGHT: Desktop view "Opens at 7:00 AM" + Sunrise Icon */}
      <div className="flex items-center gap-2 ml-2 shrink-0">
        <p className="hidden text-xs sm:text-sm font-semibold text-[#E03628] sm:block">
          Opens at {open_time}
        </p>
        <SunriseIcon className="size-5 sm:size-6 text-[#F05A28]" />
      </div>
    </div>
  );
};

export default StoreClosedBanner;
