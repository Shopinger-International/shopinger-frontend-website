import { useState, useEffect } from "react";
import type { FC } from "react";
import { cn } from "@/lib/utils";

export const isStoreClosed = (date = new Date()): boolean => {
  const hours = date.getHours();
  // Store is closed between 10:00 PM (22:00) and 6:59 AM (until 7:00 AM)
  return hours >= 22 || hours < 7;
};

export const getTimeRemaining = (
  now = new Date(),
  target_hour = 7,
  target_minute = 0,
) => {
  const target = new Date(now);

  if (now.getHours() >= 22) {
    // Between 10:00 PM and 11:59 PM: target is 7:00 AM tomorrow
    target.setDate(target.getDate() + 1);
    target.setHours(target_hour, target_minute, 0, 0);
  } else if (
    now.getHours() < 7 ||
    (now.getHours() === 7 &&
      now.getMinutes() === 0 &&
      now.getSeconds() === 0)
  ) {
    // Between 12:00 AM and 7:00:00 AM: target is 7:00 AM today
    target.setHours(target_hour, target_minute, 0, 0);
  } else {
    // Daytime preview / force_show: target is 7:00 AM tomorrow
    target.setDate(target.getDate() + 1);
    target.setHours(target_hour, target_minute, 0, 0);
  }

  const diff_ms = Math.max(0, target.getTime() - now.getTime());
  const diff_sec = Math.floor(diff_ms / 1000);

  const hrs = Math.floor(diff_sec / 3600);
  const min = Math.floor((diff_sec % 3600) / 60);
  const sec = diff_sec % 60;

  return {
    hrs: String(hrs).padStart(2, "0"),
    min: String(min).padStart(2, "0"),
    sec: String(sec).padStart(2, "0"),
  };
};

const MoonIcon: FC<{ className?: string }> = ({
  className = "size-5 text-orange-500",
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

type IStoreClosedBannerProps = {
  title?: string;
  message?: string;
  className?: string;
  force_show?: boolean;
  is_desktop_header?: boolean;
};

const StoreClosedBanner: FC<IStoreClosedBannerProps> = ({
  title = "We’re closed right now",
  message = "Order now. Delivery after 7 AM.",
  className,
  force_show = true,
  is_desktop_header = false,
}) => {
  const [is_closed, setIsClosed] = useState<boolean>(() => {
    if (force_show) return true;
    return isStoreClosed();
  });

  const [time_remaining, setTimeRemaining] = useState({
    hrs: "00",
    min: "00",
    sec: "00",
  });

  useEffect(() => {
    // Set live time and store closed status on client mount using client timezone
    setTimeRemaining(getTimeRemaining());
    if (!force_show) {
      setIsClosed(isStoreClosed());
    }

    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
      if (!force_show) {
        setIsClosed(isStoreClosed());
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [force_show]);

  // Hide immediately if force_show is false and store is not closed (7:00 AM - 9:59 PM)
  if (!force_show && !is_closed) {
    return null;
  }

  // DESKTOP BANNER (Original Design - Unchanged)
  if (is_desktop_header) {
    return (
      <div className="bg-white">
        <div
          className={cn(
            "flex w-full items-center justify-between bg-white px-6 py-1.5",
            className,
          )}
        >
          {/* LEFT: Moon Icon in Soft Circle + Title & Description */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-orange-100/90">
              <MoonIcon className="size-5 text-orange-500" />
            </div>

            <div className="flex flex-col min-w-0">
              <h3 className="text-sm font-bold leading-tight text-gray-900 truncate">
                {title}
              </h3>

              <p className="text-xs font-medium leading-tight text-gray-500 truncate mt-0.5">
                {message}
              </p>
            </div>
          </div>

          {/* RIGHT: Live Countdown Timer */}
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
            <div className="flex items-center gap-2.5 shrink-0">
              <span className="text-xs font-semibold text-gray-500 leading-tight">
                Opens in
              </span>

              <div className="flex items-center gap-1.5">
                {/* HRS Box */}
                <div className="flex flex-col items-center">
                  <div
                    suppressHydrationWarning
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-100/90 text-sm font-extrabold text-orange-500"
                  >
                    {time_remaining.hrs}
                  </div>
                  <span className="mt-0.5 text-[9px] font-bold tracking-wider text-gray-500 leading-none">
                    HRS
                  </span>
                </div>

                <span className="font-bold text-gray-700 text-sm -mt-3">
                  :
                </span>

                {/* MIN Box */}
                <div className="flex flex-col items-center">
                  <div
                    suppressHydrationWarning
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-100/90 text-sm font-extrabold text-orange-500"
                  >
                    {time_remaining.min}
                  </div>
                  <span className="mt-0.5 text-[9px] font-bold tracking-wider text-gray-500 leading-none">
                    MIN
                  </span>
                </div>

                <span className="font-bold text-gray-700 text-sm -mt-3">
                  :
                </span>

                {/* SEC Box */}
                <div className="flex flex-col items-center">
                  <div
                    suppressHydrationWarning
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-100/90 text-sm font-extrabold text-orange-500"
                  >
                    {time_remaining.sec}
                  </div>
                  <span className="mt-0.5 text-[9px] font-bold tracking-wider text-gray-500 leading-none">
                    SEC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MOBILE BANNER (New Image Design)
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between bg-[#FFF6EE] border-b border-[#F3E2D4] px-4 py-2.5 transition-all",
        className,
      )}
    >
      {/* LEFT: Moon Icon + Title & Description */}
      <div className="flex items-center gap-2.5 min-w-0">
        <MoonIcon className="size-5 text-[#FF5300] shrink-0" />

        <div className="flex flex-col min-w-0">
          <h3 className="text-xs font-extrabold leading-tight text-[#0B1E36] truncate">
            {title}
          </h3>

          <p className="text-[10px] font-medium leading-tight text-[#7D766D] truncate mt-0.5">
            {message}
          </p>
        </div>
      </div>

      {/* RIGHT: Live Countdown Timer */}
      <div className="flex items-center gap-2.5 shrink-0 ml-2">
        {/* Vertical Divider Line */}
        <div className="h-8 w-px bg-[#EBD8C9] shrink-0" />

        {/* Live Countdown Timer (Opens in HH : MM : SS) */}
        <div className="flex flex-col items-center shrink-0">
          <span className="text-[10px] font-medium text-[#938A7E] leading-none mb-1">
            Opens in
          </span>

          {/* Digits & Colons */}
          <div className="flex items-center text-xs font-extrabold leading-none text-[#FF5300]">
            <span suppressHydrationWarning className="w-5 text-center">
              {time_remaining.hrs}
            </span>
            <span className="text-gray-700 font-bold mx-0.5">:</span>
            <span suppressHydrationWarning className="w-5 text-center">
              {time_remaining.min}
            </span>
            <span className="text-gray-700 font-bold mx-0.5">:</span>
            <span suppressHydrationWarning className="w-5 text-center">
              {time_remaining.sec}
            </span>
          </div>

          {/* Sub-labels underneath digits */}
          <div className="flex items-center text-[8px] font-bold text-[#A0988C] tracking-wider leading-none mt-1">
            <span className="w-5 text-center">HRS</span>
            <span className="invisible mx-0.5">:</span>
            <span className="w-5 text-center">MIN</span>
            <span className="invisible mx-0.5">:</span>
            <span className="w-5 text-center">SEC</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreClosedBanner;
