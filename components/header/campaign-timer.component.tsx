import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

// types
import type { FC } from "react";

// helpers
import { differenceInSeconds } from "date-fns";

// hooks
import useGetTimeWindowCampaign from "@/hooks/axios/campaign/use-get-time-window-campaign.hook";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target_date: Date): TimeLeft {
  const diff_in_sec = Math.max(0, differenceInSeconds(target_date, new Date()));

  return {
    days: Math.floor(diff_in_sec / 86400),
    hours: Math.floor((diff_in_sec / 3600) % 24),
    minutes: Math.floor((diff_in_sec / 60) % 60),
    seconds: diff_in_sec % 60,
  };
}

const CampaignTimer: FC = () => {
  const { data: campaign } = useGetTimeWindowCampaign();

  const [time_left, setTimeLeft] = useState<TimeLeft | null>(null);

  const campaign_state = useMemo(() => {
    if (!campaign) return null;

    const now = new Date();

    const start_at = new Date(campaign.start_at);
    const end_at = new Date(campaign.end_at);

    if (now < start_at) {
      return {
        status: "UPCOMING" as const,
        target_date: start_at,
      };
    }

    if (now < end_at) {
      return {
        status: "ACTIVE" as const,
        target_date: end_at,
      };
    }

    return {
      status: "ENDED" as const,
      target_date: null,
    };
  }, [campaign]);

  useEffect(() => {
    if (!campaign_state?.target_date) {
      setTimeLeft(null);
      return;
    }

    const updateTimer = () => {
      setTimeLeft(getTimeLeft(campaign_state.target_date));
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [campaign_state]);

  if (!campaign || !campaign_state || campaign_state.status === "ENDED") {
    return null;
  }

  const countdown = time_left && (
    <span className="font-mono font-semibold tracking-tight">
      {time_left.days > 0 && `${time_left.days}d `}
      {String(time_left.hours).padStart(2, "0")}:
      {String(time_left.minutes).padStart(2, "0")}:
      {String(time_left.seconds).padStart(2, "0")}
    </span>
  );

  if (campaign_state.status === "UPCOMING") {
    return (
      <div className="relative border-b border-gray-300 bg-black px-4 py-2 text-white">
        <div className="flex flex-col items-center justify-center gap-1.5 text-xs md:flex-row md:gap-3 sm:text-sm">
          <span className="text-center font-semibold text-orange-500">
            👀 Dropping Soon: {campaign.title}
          </span>

          {/* Hidden on mobile, shows up on medium screens and up */}
          <span className="hidden max-w-md truncate text-center text-gray-300 lg:inline">
            {campaign.description}
          </span>

          {/* Squeezed padding slightly for mobile */}
          <div className="flex items-center gap-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 px-2.5 py-0.5 md:px-3 md:py-1">
            <span className="text-[10px] font-medium tracking-wider text-orange-500 uppercase md:text-xs">
              Starts In
            </span>
            <span className="text-orange-200">{countdown}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border-b border-red-500/20 bg-black px-4 py-2 text-white">
      {/* Container wraps nicely on desktop, cleanly stacks/sizes on mobile */}
      <div className="flex flex-col items-center justify-center gap-1.5 text-xs md:flex-row md:gap-3 sm:text-sm">
        <span className="animate-pulse text-center font-semibold text-red-500">
          🚨 {campaign.title} Live
        </span>

        {/* Hidden on mobile to save vertical landscape */}
        <span className="hidden max-w-md truncate text-center text-gray-300 lg:inline">
          {campaign.description}
        </span>

        {/* Combined countdown layout and action item wrap logic */}
        <div className="flex items-center gap-3 md:gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-0.5 md:px-3 md:py-1">
            <span className="text-[10px] font-medium tracking-wider text-red-400 uppercase md:text-xs">
              Ends In
            </span>
            <span className="font-bold text-red-200">{countdown}</span>
          </div>

          <Link
            href={`campaign/${campaign.id}/${campaign.slug}`}
            className="font-medium text-orange-400 underline underline-offset-4 transition-colors hover:text-orange-300"
          >
            Shop Deals →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CampaignTimer;
